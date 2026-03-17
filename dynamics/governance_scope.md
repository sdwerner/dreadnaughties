# DAO Governance: veDREAD Scope & Value Proposition

## The Problem

A governance token without meaningful control over revenue-generating mechanisms will lose value. For `$DREAD` governance to serve as a real token sink, the DAO must control levers that directly impact the game's economy and revenue.

## veDREAD Mechanics

Players lock `$DREAD` for a chosen duration (1 week → 4 years). Longer locks yield more voting power:

| Lock Duration | veDREAD Multiplier |
|:---|:---|
| 1 week | 1x |
| 1 month | 2x |
| 6 months | 5x |
| 1 year | 10x |
| 4 years | 40x |

## What the DAO Controls

### 1. Prediction Market Fee Rate (Revenue)
The DAO sets the protocol fee on all Arrow-Debreu token trades in the Options Market (range: 0.5%–5%). This fee flows directly to the DAO treasury.
- **Why it matters:** This is protocol revenue from non-players (speculators), making governance valuable even to non-combatants.

### 2. Combat Burn Fee Rate
The DAO sets the base burn percentage on all combat stakes (currently hardcoded at 5%).
- **Range:** 1%–10%
- **Trade-off:** Higher burns = more deflation but smaller player payouts.

### 3. Dry Dock Repair Cost Multipliers
The DAO votes on repair cost multipliers per ship class.
- **Example:** If Frigates are dominating the meta, the DAO can reduce their repair costs to encourage diversity, or increase Dreadnought repair costs if they become too prevalent.

### 4. Forge Upgrade Cost Curve
The DAO can adjust the exponential base and `$DREAD` cost per level in the Forge contract.
- **Guard rails:** Changes are capped at ±20% per governance epoch to prevent economic shocks.

### 5. New Ship Class Approval
Any new Hull class (ERC-721 with new base α/β and compartment count) must pass a DAO vote before being added to the minting contract. This prevents unilateral power creep.

### 6. Emission Schedule
The DAO controls the `$DREAD` emission rate for staking rewards. This is the most direct lever for managing inflation vs deflation.

## Treasury Revenue Sources

| Source | Flow |
|:---|:---|
| Prediction Market Fees | % of all options trades → Treasury |
| Combat Burns | 5% of all stakes → Burned (deflationary) |
| Hull Minting (Dutch Auction) | Mint proceeds → Treasury |
| Forge Upgrade Fees | Portion of `$DREAD` burns → Treasury (if DAO votes to redirect) |

## Why This Works

Unlike governance tokens that only vote on "which color should the logo be," veDREAD holders directly control:
1. **Revenue streams** (prediction market fees)
2. **Monetary policy** (emission rates, burn rates)
3. **Game balance** (repair costs, upgrade curves, new ship classes)

This makes `$DREAD` governance genuinely valuable and creates a powerful reason to lock tokens long-term.
