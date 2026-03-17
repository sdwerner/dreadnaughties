# On-Chain Infrastructure: L2 Selection & Gas Analysis

## The Problem

Executing a 5-round Polya Urn combat loop on-chain requires `keccak256` hashing per round, state updates, and cross-contract calls to `OptionsMarket`. Based on Hardhat gas profiling:

| Function | Gas Cost | ETH L1 (30 gwei) | Base L2 (~$0.001/tx) | Arbitrum (~$0.003/tx) |
|:---|:---|:---|:---|:---|
| `executeAttack` | ~270,000 | ~$2.50 | ~$0.01 | ~$0.03 |
| `mintOption` | ~130,000 | ~$1.20 | ~$0.005 | ~$0.01 |
| `exerciseOption` | ~85,000 | ~$0.80 | ~$0.003 | ~$0.008 |
| `setHuntingGrounds` | ~47,000 | ~$0.44 | ~$0.002 | ~$0.004 |

> On Ethereum L1, a single battle costs ~$2.50 in gas. This is untenable for a game where wagers may be $1–$10 worth of `$DREAD`.

## L2 Selection Criteria

1. **Gas Cost:** Must support sub-$0.05 transactions for core gameplay loops.
2. **EVM Compatibility:** Full EVM equivalence to avoid rewriting Solidity contracts.
3. **VRF Availability:** Must have native or easily integrated verifiable randomness (Chainlink VRF, Gelato VRF, or native).
4. **Ecosystem:** Active developer community and existing DeFi/gaming infrastructure.
5. **Finality Speed:** Fast enough for real-time combat (~2-5 second finality).

## Candidates

### Base (Recommended for MVP)
- **Gas:** ~$0.001-$0.01 per transaction (OP Stack)
- **EVM:** Full equivalence
- **VRF:** Chainlink VRF v2.5 available, Gelato VRF available
- **Ecosystem:** Large, growing gaming ecosystem (Onchain Summer, Farcaster integration)
- **Finality:** ~2 seconds
- **Verdict:** ✅ Best balance of cost, tooling, and community for MVP launch.

### Arbitrum
- **Gas:** ~$0.003-$0.03 per transaction (Nitro)
- **EVM:** Full equivalence
- **VRF:** Chainlink VRF v2.5 available
- **Ecosystem:** Largest L2 by TVL, strong DeFi ecosystem
- **Finality:** ~250ms (Arbitrum One)
- **Verdict:** ✅ Strong fallback. Higher gas than Base but deeper liquidity.

### Starknet
- **Gas:** Very low (~$0.001)
- **EVM:** ❌ Requires rewriting in Cairo
- **VRF:** Native VRF available
- **Ecosystem:** Growing gaming ecosystem (Loot Survivor, Realms)
- **Verdict:** ⚠️ Excellent for a fully native build, but requires complete contract rewrite. Not suitable for MVP timeline.

## Recommendation

**Deploy to Base for MVP.** Migrate contracts as-is with Chainlink VRF v2.5 integration. Evaluate Starknet for a future "V2" build if the game's computational needs outgrow the OP Stack.
