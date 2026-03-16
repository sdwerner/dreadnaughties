# Staking & The Dry Dock Economy

Instead of the hyper-punishing permadeath mechanic, **Dreadnaughties** implements a continuous, staking-based economy. This aligns perfectly with DeFi primitives and encourages long-term retention over one-off gambling.

## 1. The Core Staking Mechanic ($DREAD Generation)

A Dreadnaughtie ship (ERC-721 Hull) is not just a combat vehicle; it is an active **Yield Generator**.

*   **Yield Generation:** Simply by owning a Dreadnaughtie, it passively generates `$DREAD` tokens over time.
*   **The Multiplier:** A ship's Base Stats ($\alpha$ and $\beta$) determine its Base Yield. However, equipping components (Guns and Protection) directly acts as a **Yield Multiplier**.
    *   *A highly upgraded Dreadnaughtie with $+10 \alpha$ generates significantly more `$DREAD` per block than a bare-bones Frigate.* 
*   **The Trade-off:** Do you keep your high-yield ship safe at home generating passive income, or do you risk it in the Arena for burst rewards?

## 2. The Arena: Risking Yield, Not the NFT

When you enter the Arena, you lock your ship into the Combat Smart Contract. Combat resolves via Epochs and Hitpoints as usual.

If your ship reaches $0$ HP, it is **not** burned. It is "Disabled".

*   **The Penalty:** A Disabled ship instantly ceases all passive `$DREAD` yield generation.
*   **The Victor's Spoils:** The winning player does not take the loser's ship. Instead, they loot a percentage of the loser's *unclaimed staking yield*, and gain Arena Rating (ELO) which unlocks higher-tier Component crafting.

## 3. The Dry Dock (Economic Sink)

How does a Disabled ship return to the fight (and to passive yield generation)?

It must enter **The Dry Dock**.

*   **Repair Mechanics:** To repair a ship from $0$ HP back to $100\%$, the owner must stake the ship in the Dry Dock contract and pay a substantial `$DREAD` fee.
*   **Time Delays:** Repairs are not instant. The Dry Dock locks the NFT for a duration proportional to the ship's class and max HP (e.g., 2 days for a Frigate, 10 days for a Dreadnought).
*   **The Economic Sink:** This creates massive deflationary demand for `$DREAD`. Players who lose in the Arena are strongly incentivized to buy and burn `$DREAD` to repair their ships so they can restart their passive yield generation. 
*   **Component Degradation:** During a brutal loss, there is a small probability that a component (ERC-1155) equipped on the ship is "Damaged." Damaged components lose their stats until they are individually repaired with `$DREAD` in the Dry Dock.

## 4. The "Rent-A-Dread" Scholarship Market

Because the ships are yield-bearing assets that can be sent to the Dry Dock, we can natively support a **Delegation/Scholarship Market**.

*   **The Whales:** A player with 50 Dreadnaughties cannot fight them all in the Arena.
*   **The Scholars:** A new player without the funds to mint a ship can "Rent" one.
*   **The Smart Contract:** The Whale securely delegates the ship to the Scholar. The Scholar fights in the Arena. If they win, the Smart Contract automatically splits the `$DREAD` bounty (e.g., 70% to Whale, 30% to Scholar). If the Scholar loses, the ship goes to the Dry Dock, and the Whale (or the Scholar's collateral) pays the repair fee.

This turns Dreadnaughties from a pure combat simulator into a complex, decentralized space-naval economy.
