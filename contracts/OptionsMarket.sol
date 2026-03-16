// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OptionsMarket
 * @dev Derivative market for Dreadnaughties battles.
 * Users can lock DREAD tokens to mint "Red Heavy" or "Blue Heavy" Arrow-Debreu tokens
 * based on the expected outcome of the final 5-Round Polya Urn state space.
 */
contract OptionsMarket is ERC1155, Ownable, ReentrancyGuard {
    
    // Mapping: BattleID => (Option Type => Total Minted)
    // Option Type 0 = Red > 5 (Aggressive Result)
    // Option Type 1 = Blue >= 5 (Defensive Result)
    mapping(uint256 => mapping(uint256 => uint256)) public marketSize;
    mapping(uint256 => bool) public marketResolved;
    mapping(uint256 => uint256) public winningOptionId;

    // A mock DREAD ERC20 interface would go here
    // IERC20 public dreadToken;
    
    // Address of the authorized HuntingGrounds contract
    address public huntingGroundsAddress;

    event OptionsMinted(address indexed buyer, uint256 battleId, uint256 optionId, uint256 amount);
    event OptionsExercised(address indexed holder, uint256 battleId, uint256 payout);
    event HuntingGroundsSet(address indexed newAddress);

    constructor() ERC1155("https://api.dreadnaughties.com/options/{id}.json") Ownable(msg.sender) {}

    modifier onlyHuntingGrounds() {
        require(msg.sender == huntingGroundsAddress, "Caller is not HuntingGrounds");
        _;
    }

    function setHuntingGrounds(address _huntingGrounds) external onlyOwner {
        huntingGroundsAddress = _huntingGrounds;
        emit HuntingGroundsSet(_huntingGrounds);
    }

    /**
     * @notice Generates a unique Token ID for an option on a specific battle.
     * Combines battleId and optionType to ensure globally unique ERC-1155 tokens.
     */
    function getOptionId(uint256 battleId, uint256 optionType) public pure returns (uint256) {
        return (battleId << 128) | optionType;
    }

    /**
     * @notice Mint an Arrow-Debreu token for a specific battle.
     * @param battleId The ID from HuntingGrounds.sol
     * @param optionType 0 (Red Heavy) or 1 (Blue Heavy)
     * @param amount The number of options to mint
     */
    function mintOption(uint256 battleId, uint256 optionType, uint256 amount) external payable nonReentrant {
        require(!marketResolved[battleId], "Market already resolved");
        require(optionType == 0 || optionType == 1, "Invalid option type");

        // REQUIREMENT: Must lock DREAD tokens here (Using msg.value mock for MVP)
        require(msg.value == amount * 1 ether, "Incorrect payment");

        marketSize[battleId][optionType] += amount;
        
        uint256 expectedTokenId = getOptionId(battleId, optionType);
        _mint(msg.sender, expectedTokenId, amount, "");

        emit OptionsMinted(msg.sender, battleId, optionType, amount);
    }

    /**
     * @notice Called by the HuntingGrounds contract after the N-round Polya Urn finishes.
     * @param battleId The resolved battle
     * @param finalRed The final number of Red balls in the Urn
     * @param finalBlue The final number of Blue balls in the Urn
     */
    function resolveMarket(uint256 battleId, uint256 finalRed, uint256 finalBlue) external onlyHuntingGrounds {
        require(!marketResolved[battleId], "Already resolved");

        marketResolved[battleId] = true;

        if (finalRed > finalBlue) {
            winningOptionId[battleId] = 0; // Red Heavy wins
        } else {
            winningOptionId[battleId] = 1; // Blue Heavy wins
        }
    }

    /**
     * @notice Exercise winning options to claim a share of the loser's locked tokens.
     */
    function exerciseOption(uint256 battleId) external nonReentrant {
        require(marketResolved[battleId], "Market not resolved");

        uint256 winnerId = winningOptionId[battleId];
        uint256 loserId = winnerId == 0 ? 1 : 0;
        
        uint256 winningTokenId = getOptionId(battleId, winnerId);
        uint256 userBalance = balanceOf(msg.sender, winningTokenId);

        require(userBalance > 0, "No winning tokens");

        uint256 winnerPool = marketSize[battleId][winnerId];
        require(winnerPool > 0, "No winning distribution"); // Protects against Division by Zero
        
        uint256 loserPool = marketSize[battleId][loserId];
        uint256 totalPool = winnerPool + loserPool;
        
        // Calculate payout proportion
        uint256 payout = (userBalance * totalPool) / winnerPool;

        // Burn the option token
        _burn(msg.sender, winningTokenId, userBalance);

        // Payout the DREAD (using ether for MVP mock)
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");

        emit OptionsExercised(msg.sender, battleId, payout);
    }
}
