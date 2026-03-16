// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HuntingGrounds
 * @dev The core combat engine for Dreadnaughties. 
 * Implements the N-round Polya Urn state space drawing to resolve attacks on the Open Sea.
 */
contract HuntingGrounds {

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
    // If starting with (1 Red, 1 Blue), ending with > 5 Red balls out of 10 total might be a win.
    // This threshold will be mathematically refined.
    uint256 public constant WIN_THRESHOLD_MULTIPLIER = 2; 

    mapping(uint256 => BattleRecord) public battles;
    uint256 public battleCounter;

    event BattleInitiated(uint256 indexed battleId, address indexed attacker, address indexed defender);
    event BattleResolved(uint256 indexed battleId, bool attackerWon, uint256 finalRed, uint256 finalBlue);

    /**
     * @notice Initiates a battle using a pseudo-random Polya Urn simulation.
     * @dev In a production environment, this MUST be connected to Chainlink VRF. 
     * For the MVP, we use block parameters to simulate the draws synchronously.
     *
     * @param _attackerRed Attacker's Alpha stat
     * @param _defenderBlue Defender's Beta stat
     * @param _defender Address of the Open Sea target
     * @param _strikePrice The requested Arrow-Debreu claim (number of Red balls expected)
     * @param _defenderYield The current accumulated yield of the target (Mocked for MVP)
     */
    function executeAttack(
        uint256 _attackerRed, 
        uint256 _defenderBlue, 
        address _defender, 
        uint256 _strikePrice,
        uint256 _defenderYield
    ) external payable {
        // Attacker must send a stake (The Premium)
        require(msg.value > 0, "Must stake DREAD (ETH for MVP) to attack");
        require(_strikePrice > _attackerRed, "Strike price must be > initial Red balls");

        // Initialize the Urn
        // The Urn is a combination of the Attacker's offensive power (Red) and the Defender's defensive power (Blue)
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
            
            // SECURITY WARNING: block.prevrandao is NOT secure for production gambling. Replace with VRF.
            uint256 randomDraw = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i))) % totalBalls;

            if (randomDraw < currentUrn.redBalls) {
                currentUrn.redBalls += 1;
                redDrawn += 1;
            } else {
                currentUrn.blueBalls += 1;
                blueDrawn += 1;
            }
        }

        // Determine Outcome based on Final State Space vs Strike Price
        bool isVictory = currentUrn.redBalls >= _strikePrice;

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
            // THE ATTACKER'S REWARD (THE MAX FUNCTION)
            // They successfully hit their Arrow-Debreu Options strike price.
            // Payout = (Red Drawn / Battle Rounds) * Defender's Yield
            uint256 payoutRatio = (redDrawn * 100) / BATTLE_ROUNDS; // Percentage
            uint256 payout = (_defenderYield * payoutRatio) / 100;
            
            // Return their stake (minus the base burn fee) + the expropriated yield
            uint256 attackerReturn = (msg.value - baseBurnFee) + payout;
            payable(msg.sender).transfer(attackerReturn); 
            
            // Note: In MVP, _defenderYield is mocked. Real contract would subtract from DreadnaughtieHull.
            // The baseBurnFee implicitly remains in the contract as "burned".
        } else {
            // THE DEFENDER'S REWARD (THE MIN FUNCTION)
            // The Attacker's Option expires worthless. 
            // The Defender captures a portion of the stake (minus the burn fee) based on their Blue balls.
            uint256 remainingStake = msg.value - baseBurnFee;
            uint256 rewardRatio = (blueDrawn * 100) / BATTLE_ROUNDS; // Percentage
            uint256 reward = (remainingStake * rewardRatio) / 100;

            if (reward > 0) {
                payable(_defender).transfer(reward);
            }

            // THE DEFLATIONARY SINK
            // The residual msg.value (Stake - Reward) remains in this contract functionally "burned".
            // This is significantly larger on a loss than the base 5% burn fee.
        }

        emit BattleResolved(currentBattleId, isVictory, currentUrn.redBalls, currentUrn.blueBalls);
    }
}
