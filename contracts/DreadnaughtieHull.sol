// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IComponentFactory {
    function getStats(uint256 id) external view returns (uint256 alpha, uint256 beta);
}

/**
 * @title DreadnaughtieHull
 * @dev Base ERC-721 for ships. Tracks equipped components and handles "Open Sea" Staking yield.
 */
contract DreadnaughtieHull is ERC721, Ownable {

    IComponentFactory public componentFactory;

    struct ShipData {
        uint256 baseAlpha; // Base Red Bulls
        uint256 baseBeta;  // Base Blue Bulls
        uint256[] equippedComponents; // IDs from ComponentFactory
        uint256 lastStakeTime;
        bool isStaking;
    }

    mapping(uint256 => ShipData) public ships;
    uint256 public nextTokenId = 1;

    // Yield rate: e.g., 100 DREAD tokens per day per Beta (Protection) stat
    uint256 public constant BASE_YIELD_PER_BETA = 100 ether; 

    constructor(address _componentFactoryAddress) ERC721("Dreadnaughtie", "DREADSHIP") Ownable(msg.sender) {
        componentFactory = IComponentFactory(_componentFactoryAddress);
    }

    function mintBaseShip(address to) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);

        // Every new ship starts entirely neutral (Beta(1,1))
        ships[tokenId] = ShipData({
            baseAlpha: 1,
            baseBeta: 1,
            equippedComponents: new uint256[](0),
            lastStakeTime: 0,
            isStaking: false
        });
    }

    /**
     * @notice Calculates the total Alpha and Beta of the ship + equipped components.
     */
    function getTotalStats(uint256 tokenId) public view returns (uint256 totalAlpha, uint256 totalBeta) {
        ShipData memory ship = ships[tokenId];
        totalAlpha = ship.baseAlpha;
        totalBeta = ship.baseBeta;

        for (uint256 i = 0; i < ship.equippedComponents.length; i++) {
            (uint256 alpha, uint256 beta) = componentFactory.getStats(ship.equippedComponents[i]);
            totalAlpha += alpha;
            totalBeta += beta;
        }
    }

    /**
     * @notice Enters the Open Sea to begin passive staking.
     * Yield is entirely reliant on the ship's Beta (Protection) stats.
     */
    function enterOpenSea(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!ships[tokenId].isStaking, "Already in Open Sea");

        ships[tokenId].isStaking = true;
        ships[tokenId].lastStakeTime = block.timestamp;
    }

    /**
     * @notice Calculates the pending DREAD yield.
     * Formula: (Time Staked / 1 Day) * Total Beta * BASE_YIELD
     * Alpha (Guns) provides zero passive yield.
     */
    function calculatePendingYield(uint256 tokenId) public view returns (uint256) {
        if (!ships[tokenId].isStaking) return 0;

        (, uint256 totalBeta) = getTotalStats(tokenId);
        uint256 timeStaked = block.timestamp - ships[tokenId].lastStakeTime;
        uint256 daysStaked = timeStaked / 1 days;

        return daysStaked * totalBeta * BASE_YIELD_PER_BETA;
    }

    // Note: Mock for MVP. Real DREAD ERC-20 minting would occur here.
    function claimYield(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(ships[tokenId].isStaking, "Not in Open Sea");

        uint256 yieldAmount = calculatePendingYield(tokenId);
        require(yieldAmount > 0, "No yield to claim");

        // Reset timer
        ships[tokenId].lastStakeTime = block.timestamp;
        
        // DREAD.mint(msg.sender, yieldAmount);
    }
}
