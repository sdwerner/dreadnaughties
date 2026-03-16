# Scalability of the Bayesian Beta Engine

The Bayesian model using the Beta Distribution $Beta(\alpha, \beta)$ is highly scalable for introducing new ships, mechanics, and features. Its strength lies in its mathematical flexibility and the ability to represent complex interactions through just two parameters.

Here is a breakdown of how the idea scales to new features:

## 1. Scaling to New Ship Classes (Base Stats)

Right now, we assume a base ship starts at $Beta(1, 1)$, which is a flat uniform distribution (every roll from 0.0 to 1.0 is equally likely). We can easily introduce diverse ship hulls that alter this baseline:

*   **The Scout Ship (High Floor, Low Ceiling):** Starts at $Beta(2, 2)$. The mean is still 50%, but the curve is a bit taller in the middle. It's less likely to roll a 0.1, but also less likely to roll a 0.9. It's consistent.
*   **The Sniper Frigate ($Beta(1, 3)$):** Starts with a low mean (25%), but has specialized component slots that allow it to equip massive, high-variance Alpha weapons.
*   **The Dreadnought ($Beta(5, 5)$):** A massive, stable base. It requires immense component investment to shift its curve left or right because the base values are so high (an extra +1 Alpha barely moves a $Beta(5, 5)$ curve compared to a $Beta(1, 1)$).

**Scalability Rating: High.** New ships don't require new math; they just require different starting parameters for $\alpha$ and $\beta$.

## 2. Scaling to Multi-Variable Combat (More than just Alpha/Beta)

If the game expands beyond a simple "Highest Roll Wins," we can scale the engine to handle multidimensional combat. 

Instead of just one global $Beta$ roll, a ship could have multiple distributions:
*   **Weapons System:** $Beta(X_w, Y_w)$ -> Rolls to determine *damage*.
*   **Defense System:** $Beta(X_d, Y_d)$ -> Rolls to determine *evasion* or *damage mitigation*.
*   **Electronic Warfare (E-War):** $Beta(X_e, Y_e)$ -> Rolls to determine *utility effects*.

Components would apply strictly to their relevant subsystems. For example, a "Heavy Laser" gives +3 $\alpha$ to Weapons, while "Jamming Chaff" gives +2 $\beta$ to Defense.

**Scalability Rating: Moderate.** This requires expanding the Zustand state and UI to handle multiple concurrent distributions, but the foundational math engine (`randomBeta`) handles this natively without rewriting core logic.

## 3. Scaling to Dynamic / Mid-Combat Modifiers

The Bayesian model excels at updating probabilities based on *new evidence*. We can introduce mid-battle mechanics that temporarily alter $\alpha$ and $\beta$:

*   **Consumables / Active Abilities:** A player clicks "Overcharge Reactor" during combat. For the next roll, their $\alpha$ gets a +5 modifier, but their ship takes structural damage.
*   **Environmental Effects (The "Board"):** If players fight in a "Nebula" zone (a smart contract modifier), all ships receive a flat +2 $\beta$ (making hits less likely for everyone).
*   **Status Effects:** If a ship is hit by an "EMP Torpedo," its effective $\alpha$ is reduced by 50% for 2 turns.

**Scalability Rating: High.** Because our `getActiveStats()` function in the state manager dynamically calculates the totals before every roll, adding temporary modifiers to the array is computationally trivial.

## 4. Scaling the Tokenomics (The Economic Sandbox)

As we add hundreds of components, the economic balance could threaten to break the game (power creep). However, the Beta distribution naturally scales economically:

*   **The Math Prevents Runaway Power:** Going from $\alpha=1$ to $\alpha=2$ provides a massive 16% win rate boost. Going from $\alpha=50$ to $\alpha=60$ provides almost no noticeable benefit. 
*   **Token Sinks:** Because of this diminishing return, high-tier players are forced to spend exponentially more `$DREAD` tokens to craft components that yield marginal gains. This curve acts as a natural token sink, keeping the economy healthy even as more powerful items are introduced.
*   **Component Degradation:** We can introduce a mechanic where high Variance (extreme $\alpha$ or $\beta$ values) increases the chance of a component "burning out" or requiring `$DREAD` repairs, forcing players to find a sweet spot between power and economic sustainability.

## Conclusion

The Bayesian model is incredibly robust. By abstracting all combat mechanics into shifts along the $\alpha$ and $\beta$ axes (or multiple sets of them), we can introduce virtually infinite combinations of ships, weapons, and environments without ever having to write bespoke, hardcoded "If X attacks Y, do Z" edge cases. The math resolves the complexity automatically.
