# Arena Incentives & Match Allocation

If staking provides safe, passive yield, why would a player ever risk their ship in the Arena?

## 1. The Incentive to Battle (The Loot)

Passive staking is slow. The Arena provides the only mechanism to *accelerate* your token accumulation and acquire unique assets necessary for scaling the Bayesian Power Curve.

*   **The Alpha Wager (The Pot):** Both players must lock a wager of `$DREAD` tokens to initiate combat. The victor claims the pot (minus a 5% protocol fee). This allows skilled players with optimized ships to extract capital linearly faster than passive stakers.
*   **The Urn Loot (ERC-1155s):** The *only* way to acquire new Component NFTs (Guns and Protection) organically is by winning Battles. A victorious ship has a random chance (governed by another on-chain Beta roll) to "salvage" component NFTs from the wreckage.
*  **The Upgrade Prerequisite (Glory):** To upgrade a component from Level 2 to Level 3 in the Forge, you don't just need `$DREAD` token—you need a specific numerical **Arena Rating (ELO)**. If you just passively stake, you will never gain the ELO required to craft top-tier components.

## 2. The Allocation Mechanism (The Matchmaker)

A decentralized, asynchronous Matchmaking Engine is critical to prevent "Whales" from hunting low-level "Frigates" for easy `$DREAD`.

*   **The Lobby (Asynchronous Allocation):**
    *   Player A commits a "Challenge" transaction to the Smart Contract containing: `<Wager Amount>`, `Ship ELO`, and a hidden payload of their Ship's exact Component Loadout (via zk-SNARK or hashed commit-reveal scheme).
    *   The Lobby acts as a decentralized Order Book.
*   **The Match (The ELO Engine):**
    *   Player B scans the public Order Book. They can only accept Challenges where the Wager amounts match and the Ship ELO is within a `+/- 10%` band of their own.
*   **The Reveal & Resolution:**
    *   Once Player B accepts, both players "Reveal" their hidden component loadout transactions, locking the combat math. (If a player fails to reveal, they forfeit their wager).
    *   The Chainlink VRF oracle then draws the required random numbers (the Epochs), and the smart contract processes the Hitpoints based on the competing Beta distributions.

## 3. The Meta-Game 

Because battles are tiered by ELO and Wager, the mathematical incentives balance out perfectly:

1.  **Low ELO:** New players fight with basic $Beta(1,1)$ ships, wagering small amounts of `$DREAD` and grinding for basic Component NFTs to start crafting.
2.  **Mid ELO:** Players begin to see the diminishing returns of the Bayesian curve. They experiment with wild builds (Glass Cannons vs Juggernauts). The Wagers are substantial, and the Spectator Market (Arrow-Debreu trading) becomes highly lucrative.
3.  **High ELO (The Leviathans):** Massive, highly optimized ships fighting for enormous pools of `$DREAD`. Because their win-rates are incredibly tight (e.g., $Beta(50, 48)$ vs $Beta(48, 50)$), these fights are highly technical. An entire shadow economy springs up just trading derivates on the outcome of a single Epoch in a Leviathan clash.
