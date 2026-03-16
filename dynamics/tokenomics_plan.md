# Tokenomics & NFT Architecture

**Dreadnaughties** utilizes a multi-token architecture to create a deep, self-sustaining economy based on the Bayesian Beta distribution mechanic.

## 1. The Assets 

### The Hull (ERC-721 NFT)
The Hull is your unique ship. It provides the base statistics ($\alpha$ and $\beta$) and, most importantly, **Compartments (Capacity Slots)**.
*   **Example:** `Dreadnaughtie #402 (Class: Frigate)`
*   **Base Stats:** $Beta(2, 2)$
*   **Capacity:** 5 Compartments

### The Components (ERC-1155 SFTs)
Components are stackable tokens that you equip into your Hull's Compartments. They come in two primary categories:
1.  **Guns (Alpha Boosters):** Adds Red Balls to the Urn.
2.  **Protection (Beta Boosters):** Adds Blue Balls to the Urn (for your opponent's draws, or for your own survivability draws depending on the combat ruleset).

*A player must make strategic choices: do I put 5 Guns in my 5 compartments, making me a Glass Cannon? Or 3 Guns and 2 Protections for a balanced build?*

---

## 2. The Upgrade Loop (Token Sink)

This is where the `$DREAD` ERC-20 token comes in. The Bayesian math inherently requires exponential growth to achieve linear win-rate gains at high levels.

Players can use the **Forge Smart Contract** to upgrade Components.

*   **Level 1 Gun (+1 $\alpha$):** Found as basic loot or minted cheaply.
*   **Level 2 Gun (+2 $\alpha$):** Requires burning **2x Level 1 Guns** + **100 $DREAD**.
*   **Level 3 Gun (+3 $\alpha$):** Requires burning **2x Level 2 Guns** + **400 $DREAD**.
*   **Level N Gun (+N $\alpha$):** Requires burning $2^{N-1}$ base guns and an exponentially increasing amount of `$DREAD`.

**Why this works:** Because of the Compartment limit (e.g., 5 slots), a player *must* upgrade their individual components to get stronger. Since upgrading requires burning lower-tier NFTs and massive amounts of `$DREAD`, it naturally controls inflation and prevents whales from trivializing the economy, as the math demands thousands of dollars for a 0.5% edge at the top tier.

---

## 3. The Economic Flywheel

1.  **Minting/Looting:** Players acquire cheap base components and basic Hulls.
2.  **The Arena (PvP):** Players wage `$DREAD` tokens on combat outcomes. The smart contract draws from their combined Beta distribution/Urn.
3.  **The Earnings:** The winner takes the `$DREAD` pot (minus a small protocol fee).
4.  **The Sink:** The winner uses their `$DREAD` earnings & burns extra components to craft higher-tier assets to stay competitive.
5.  **The Speculators:** As established previously, spectators can trade Arrow-Debreu tokens (Red Win / Blue Win) on the combat outcomes, injecting outside liquidity into the prize pools.

## 4. On-Chain Feasibility & "Composability"

Using **ERC-6551 (Token Bound Accounts)**, the Hull (ERC-721) can actually *own* the Components (ERC-1155) directly. 

Instead of a centralized database tracking which guns are on which ship, the Dreadnaughtie Hull NFT has its own wallet address. You simply transfer the Gun NFTs into the Hull's wallet, and the combat smart contract reads the Hull's inventory directly on-chain to determine its $\alpha$ and $\beta$ before the battle!
