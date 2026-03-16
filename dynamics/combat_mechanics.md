# Combat Architecture: Epochs & Resolution

The Dreadnaughties Bayesian engine can be expanded from a simple "single roll" resolution into a deep, strategic, multi-round combat system using Epochs and Hitpoints.

## 1. Time Scaling: The Epoch System

Instead of a battle resolving instantly in one block, we introduce **Epochs** (e.g., 1 Epoch = 1 Ethereum Block, or 1 in-game Turn).

This allows for deep strategic depth and "Information Warfare."
*   **The Setup:** Both players lock their Dreadnaughtie into the Arena contract.
*   **The Engagement (e.g., 5 Epochs):** Every Epoch, the contract draws a new ball from the combined $Beta$ Urn for each ship's weapon systems.
*   **The Reveal:** Players do not know *exactly* what the opponent's stats are. They only see the *results* of the Epoch draws.
*   **Hedging Mid-Battle:** If you see your opponent land two critical hits in Epoch 1 and 2, the AMM automatically reprices the Arrow-Debreu tokens. You can buy "Defeat Insurance" mid-battle at a premium, or choose to "Retreat" and forfeit a portion of your wager rather than lose your ship.

---

## 2. Delayed Resolution: Torpedo Mechanics

A Torpedo fired in Epoch $X$ that arrives in Epoch $X+Y$ is a brilliant mechanic that perfectly utilizes the Blockchain's state machine.

*   **The Action:** In Epoch 1, Player A spends an action (or a consumable NFT) to fire a "Heavy Torpedo".
*   **The Delay:** The Smart Contract registers a "Pending Event" scheduled for Epoch 4 (3 Epochs later).
*   **The Counter-Play:** Player B sees the pending Torpedo on-chain. They now have 3 Epochs to react.
    *   Do they use a "Thruster Burst" consumable to temporarily increase their $\beta$ (Evasion) for Epoch 4?
    *   Do they fire "Point Defense Lasers," which shifts the Torpedo's independent $Beta$ draw toward a miss?
*   **The Impact:** In Epoch 4, the Smart Contract rolls a specific, isolated Beta draw exclusively for that Torpedo to see if it hits, dealing massive structural damage if it succeeds.

---

## 3. Battle Outcome Resolution: Individual Hitpoints

A binary "Win/Loss" on a single draw is too simple for a game with delays and counter-play. We must introduce **Hitpoints (HP) / Structural Integrity**.

*   **The Hull:** Every ERC-721 Hull has a base HP (e.g., 1000 HP for a Frigate, 5000 HP for a Dreadnought).
*   **The Draw:** When the Smart Contract draws a Red Ball (Success) for your Guns, it doesn't just mean "You Win". It dictates *how much damage* you deal this Epoch.
    *   **The Math:** We can map the Beta draw result ($0.0$ to $1.0$) directly to a damage scalar. 
    *   If your Base Damage is 100, and your curve draws a `0.85` (a great hit), you deal 85 Damage to the enemy's HP.
    *   If you draw a `0.10` (a glancing blow), you only deal 10 Damage.
*   **Incentive Alignment:** If both players survive all 5 Epochs, the player with the *highest remaining % of HP* wins the prize pool.

## 4. The Stakes (Incentivization)

Why bring a highly-upgraded Dreadnaughtie into the Arena?

1.  **Wagering:** Both players put up 500 `$DREAD` to fight. Winner takes 95% of the pot.
2.  **Loot Drops:** Winning a battle has a small % chance to mint a new, rare Component NFT directly to your Hull's ERC-6551 wallet.
3.  **The Ultimate Risk (Ship Destruction):** If a ship reaches 0 HP before the Epochs end, it is "Destroyed". The ERC-721 NFT is permanently **Burned**, removing supply from the market and making all remaining Dreadnaughties more valuable. The victor loots the wreckage for massive `$DREAD` rewards.
