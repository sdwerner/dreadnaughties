# Combat Architecture: The Polya Urn Engine

All combat in Dreadnaughties is resolved through the **5-Round Polya Urn** model. This document defines the canonical rules for how battles are initiated, resolved, and rewarded.

## 1. Core Rule: The Urn Resets Per Battle

> **IMPORTANT:** The Polya Urn state is **ephemeral**. It is initialized fresh at the start of every battle using the Attacker's Alpha and the Defender's Beta, and is discarded after the 5 rounds conclude. Winning a battle does **not** permanently add balls to a player's urn. All permanent stat changes must occur through the Forge (burning `$DREAD` to upgrade components).

This design prevents the "snowball effect" where early winners become unbeatable, and ensures the diminishing-returns curve of the upgrade system remains the sole path to power.

## 2. Battle Resolution (5-Round Draw)

1. **Urn Initialization:** The smart contract creates a temporary urn:
   - **Red Balls** = Attacker's total Alpha (base hull α + equipped Gun components)
   - **Blue Balls** = Defender's total Beta (base hull β + equipped Protection components)

2. **Drawing Phase (5 Rounds):** Each round:
   - A random ball is drawn from the urn.
   - The ball is returned, and **one additional ball of the same color** is added (reinforcement).
   - This means within a single battle, momentum can shift — but only temporarily.

3. **Victory Condition:** The attacker wins if they draw **≥ 3 Red balls** out of 5 rounds (`WIN_THRESHOLD_RED_DRAWN = 3`).

4. **Urn Disposal:** After resolution, the urn is discarded. No permanent stat changes occur.

## 3. The Stakes

### Base Burn Fee (Deflationary Mechanic)
Every attack burns **5% of the attacker's stake** regardless of outcome. This ensures every battle contributes to token deflation.

### Attacker Wins
- The payout scales with how dominant the victory was (ratio of red balls drawn).
- The attacker receives their remaining stake (minus burn fee) plus a percentage of the defender's accumulated yield.

### Attacker Loses
- A portion of the attacker's remaining stake is awarded to the defender, scaled by defensive performance (ratio of blue balls drawn).

### Ship Damage (Dry Dock)
When a ship loses a battle, it is **Disabled** (not destroyed). The owner must pay `$DREAD` in the Dry Dock to reactivate it and resume passive yield generation. See `staking_mechanics.md` for details.

## 4. Time Scaling: The Epoch System (Future)

For deeper strategic play, the 5-round system can be expanded into **Epochs** (e.g., 1 Epoch = 1 block or 1 in-game turn). This introduces:
- **Information Warfare:** Players see draw results per-epoch but not opponent stats.
- **Mid-Battle Hedging:** The prediction market (Arrow-Debreu tokens) can reprice between epochs.
- **Retreat Mechanic:** A player can forfeit a portion of their wager to withdraw rather than risk total loss.

## 5. Advanced Mechanics (Post-MVP)

### Torpedo Mechanics (Delayed Resolution)
A Torpedo fired in Epoch X arrives in Epoch X+Y. The defender has Y epochs to react with consumables or defensive abilities. On arrival, the torpedo resolves via its own isolated Polya Urn draw.

### Hitpoint System
Instead of binary win/loss, each successful draw deals damage proportional to the draw result (mapped from 0.0–1.0 to a damage scalar). The player with the highest remaining HP percentage wins.
