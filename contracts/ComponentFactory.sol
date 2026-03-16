// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ComponentFactory
 * @dev ERC-1155 contract tracking the modular components for Dreadnaughties.
 * Token IDs will map to specific stats.
 * ID 1 = Mk1 Gun (+1 Alpha / Red Ball)
 * ID 2 = Mk1 Turtle Shell (+1 Beta / Blue Ball)
 */
contract ComponentFactory is ERC1155, Ownable {

    uint256 public constant MK1_GUN = 1;
    uint256 public constant MK1_TURTLE_SHELL = 2;

    struct ComponentStats {
        uint256 alphaBoost; // Red Balls (Attack)
        uint256 betaBoost;  // Blue Balls (Defense/Yield)
    }

    mapping(uint256 => ComponentStats) public stats;

    constructor() ERC1155("https://api.dreadnaughties.com/metadata/{id}.json") Ownable(msg.sender) {
        // Initialize base components
        stats[MK1_GUN] = ComponentStats({alphaBoost: 1, betaBoost: 0});
        stats[MK1_TURTLE_SHELL] = ComponentStats({alphaBoost: 0, betaBoost: 1});
    }

    function mint(address account, uint256 id, uint256 amount) external onlyOwner {
        _mint(account, id, amount, "");
    }

    function getStats(uint256 id) external view returns (uint256 alpha, uint256 beta) {
        return (stats[id].alphaBoost, stats[id].betaBoost);
    }
}
