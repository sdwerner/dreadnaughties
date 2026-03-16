# On-Chain Feasibility of the Bayesian Beta Engine

Running the Dreadnaughties game engine entirely on-chain (e.g., as a Solidity smart contract) presents unique challenges and fascinating opportunities. 

Can this dynamic work on-chain? **Yes, but it requires specific mathematical adaptations.**

## The Core Challenge: Floating-Point Math

The EVM (Ethereum Virtual Machine) and most smart contract environments **do not natively support floating-point arithmetic**. 

Our current JavaScript and Python implementations rely heavily on floating-point numbers to generate distributions (e.g., calculating $Beta(3, 1)$ requires evaluating complex integrals/gamma functions and dealing with floats like `0.75123`).

## How to Adapt the Math for On-Chain Execution

To make the Bayesian model work in a smart contract, we must use **Fixed-Point Math approximations** or **Pre-computed Lookups**.

### Solution 1: Taylor Series Expansions (Fixed-Point Math)
Libraries like **PRBMath** (by Paul R. Berg) allow advanced mathematical operations (logarithms, exponentials) in Solidity using fixed-point numbers (e.g., $10^{18}$ representing the decimal $1.0$).
*   **Feasibility:** Moderate. We can write an approximation of the Beta inverse cumulative distribution function (CDF) in Solidity. 
*   **Gas Cost:** High. Calculating transcendental functions on-chain is extremely gas-intensive.

### Solution 2: The Urn Model (Discrete Approximation)
The Beta distribution is the continuous version of the discrete **Polya Urn model**. 
Instead of calculating complex continuous curves, we can model combat as drawing colored balls from an urn:
*   $\alpha$ = Number of "Hit" balls in the urn.
*   $\beta$ = Number of "Miss" balls in the urn.
*   The contract generates a random integer and checks if it hits a "Hit" ball.
*   **Feasibility:** Very High. EVMs are excellent at discrete integer math. 
*   **Gas Cost:** Very Low. 

### Solution 3: Off-Chain Computation with ZK-Proofs
If the continuous Beta math is strictly necessary for gameplay nuance, we execute the math *off-chain* and verify it *on-chain*.
*   The player submits their loadout ($\alpha, \beta$).
*   An off-chain backend (or the player's browser) generates the random roll, computes the Beta distribution result, and generates a Zero-Knowledge Proof (zk-SNARK/STARK) proving the math was done correctly.
*   The smart contract simply verifies the proof in $O(1)$ time.
*   **Feasibility:** High (via platforms like Axiom or Risc0).
*   **Gas Cost:** Low to verify.

## Sourcing Randomness (RNG)

A Bayesian model requires an unpredictable pseudo-random number to draw from the distribution curve.

*   You **cannot** use `block.timestamp` or `blockhash` in Solidity, as miners/validators can manipulate these values to guarantee a win.
*   **The Solution:** We must integrate an oracle like **Chainlink VRF** (Verifiable Random Function). 
    *   **Workflow:** Player clicks "Attack". The contract requests a random number from Chainlink. Next block, Chainlink provides a cryptographically secure random `uint256`. The contract uses this `uint256` to pick from the Polya Urn (or input into the fixed-point Beta inverse CDF) and resolves the battle.

## Conclusion and Architecture Recommendation

The Dreadnaughties engine **is completely viable on-chain**, provided we adopt the following architecture for a V1:

1.  **State Layer (Smart Contracts):** Define $\alpha$ and $\beta$ as simple `uint256` integers. Track component ownership as ERC-1155 tokens.
2.  **Combat Resolution (The Urn Approximation):** Instead of calculating complex floating-point integrals, simplify the Beta draw to an integer-based weighted random draw (Polya Urn model), which is mathematically identical in outcome but costs pennies in gas.
3.  **Randomness:** Use Chainlink VRF to resolve the combat reliably.

This makes the engine 100% decentralized, fully verifiable, and economically secure for `$DREAD` token wagering.
