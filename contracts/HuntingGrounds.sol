// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HuntingGrounds
 * @dev The core combat engine for Dreadnaughties. 
 * Implements the N-round Polya Urn state space drawing to resolve attacks on the Open Sea.
 */
contract HuntingGrounds is ReentrancyGuard {

    struct Urn {
        uint256 redBalls;   // Alpha (Guns)
        uint256 blueBalls;  // Beta (Protection/Defense)
    }

    struct BattleRecord {
        address attacker;
        address defender;
        uint256 initialRed;
        uint256 initialBlue;
        uint256 finalRed;
        uint256 finalBlue;
        uint256 roundsFought;
        bool attackerWon;
    }

    // Number of draws required to resolve a battle
    uint256 public constant BATTLE_ROUNDS = 5;

    // Threshold of Red Balls needed at the end of the Urn draw for the Attacker to win
    // In a 5 round battle, >= 3 red balls drawn means victory.
    uint256 public constant WIN_THRESHOLD_RED_DRAWN = 3; 

    mapping(uint256 => BattleRecord) public battles;
    uint256 public battleCounter;

    event BattleInitiated(uint256 indexed battleId, address indexed attacker, address indexed defender);
    event BattleResolved(uint256 indexed battleId, bool attackerWon, uint256 finalRed, uint256 finalBlue);

    /**
     * @notice Initiates a battle using a pseudo-random Polya Urn simulation.
     * @dev In a production environment, this MUST be connected to Chainlink VRF. 
     * For the MVP, we use block parameters to simulate VRF callback synchronously,
     * but we remove the arbitrary _strikePrice vulnerability.
     *
     * @param _attackerRed Attacker's Alpha stat
     * @param _defenderBlue Defender's Beta stat
     * @param _defender Address of the Open Sea target
     * @param _defenderYield The current accumulated yield of the target (Mocked for MVP)
     */
    function executeAttack(
        uint256 _attackerRed, 
        uint256 _defenderBlue, 
        address _defender, 
        uint256 _defenderYield
    ) external payable nonReentrant {
        // Attacker must send a stake (The Premium)
        require(msg.value > 0, "Must stake DREAD (ETH for MVP) to attack");

        // Initialize the Urn
        Urn memory currentUrn = Urn({
            redBalls: _attackerRed,
            blueBalls: _defenderBlue
        });

        require(currentUrn.redBalls + currentUrn.blueBalls > 0, "Empty Urn");

        battleCounter++;
        uint256 currentBattleId = battleCounter;

        emit BattleInitiated(currentBattleId, msg.sender, _defender);

        uint256 redDrawn = 0;
        uint256 blueDrawn = 0;

        // Simulate N rounds of the Polya Urn
        for (uint256 i = 0; i < BATTLE_ROUNDS; i++) {
            uint256 totalBalls = currentUrn.redBalls + currentUrn.blueBalls;
            
            // SECURITY NOTE: This is a placeholder for Chainlink VRF in production.
            // DO NOT USE block parameters for randomness in production.
            uint256 randomDraw = uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), msg.sender, i))) % totalBalls;

            if (randomDraw < currentUrn.redBalls) {
                currentUrn.redBalls += 1;
                redDrawn += 1;
            } else {
                currentUrn.blueBalls += 1;
                blueDrawn += 1;
            }
        }

        // Determine Outcome based on Contract Rules (NOT user input)
        bool isVictory = redDrawn >= WIN_THRESHOLD_RED_DRAWN;

        battles[currentBattleId] = BattleRecord({
            attacker: msg.sender,
            defender: _defender,
            initialRed: _attackerRed,
            initialBlue: _defenderBlue,
            finalRed: currentUrn.redBalls,
            finalBlue: currentUrn.blueBalls,
            roundsFought: BATTLE_ROUNDS,
            attackerWon: isVictory
        });

        // 5% of the initial stake is ALWAYS burned, even on victory, to ensure strict deflation.
        uint256 baseBurnFee = (msg.value * 5) / 100;

        if (isVictory) {
            // THE ATTACKER'S REWARD
            uint256 payoutRatio = (redDrawn * 100) / BATTLE_ROUNDS; // Percentage
            uint256 payout = (_defenderYield * payoutRatio) / 100;
            
            uint256 attackerReturn = (msg.value - baseBurnFee) + payout;
            
            // Use call instead of transfer for reentrancy safety & gas limits
            (bool success, ) = payable(msg.sender).call{value: attackerReturn}("");
            require(success, "Transfer failed"); 
            
        } else {
            // THE DEFENDER'S REWARD
            uint256 remainingStake = msg.value - baseBurnFee;
            uint256 rewardRatio = (blueDrawn * 100) / BATTLE_ROUNDS; // Percentage
            uint256 reward = (remainingStake * rewardRatio) / 100;

            if (reward > 0) {
                (bool success, ) = payable(_defender).call{value: reward}("");
                require(success, "Transfer failed");
            }
        }

        emit BattleResolved(currentBattleId, isVictory, currentUrn.redBalls, currentUrn.blueBalls);
    }
}
