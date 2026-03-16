import numpy as np
from scipy.stats import beta
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def simulate_battle(alpha_p1, beta_p1, alpha_p2, beta_p2, num_simulations=10000):
    """
    Simulate a battle between two players with different alpha and beta stats.
    Each player draws a random number from their respective Beta distribution.
    The highest number wins.
    """
    p1_draws = beta.rvs(alpha_p1, beta_p1, size=num_simulations)
    p2_draws = beta.rvs(alpha_p2, beta_p2, size=num_simulations)
    
    p1_wins = np.sum(p1_draws > p2_draws)
    p2_wins = np.sum(p2_draws > p1_draws)
    ties = np.sum(p1_draws == p2_draws)
    
    p1_win_rate = p1_wins / num_simulations
    p2_win_rate = p2_wins / num_simulations
    
    return p1_win_rate, p2_win_rate

def plot_distributions(alpha_p1, beta_p1, alpha_p2, beta_p2, title="Beta Distributions"):
    """
    Plot the PDF of two Beta distributions to visualize their overlap and shape.
    """
    x = np.linspace(0, 1, 1000)
    y1 = beta.pdf(x, alpha_p1, beta_p1)
    y2 = beta.pdf(x, alpha_p2, beta_p2)

    plt.figure(figsize=(10, 6))
    plt.plot(x, y1, 'b-', lw=2, label=f'Player 1 Beta({alpha_p1}, {beta_p1})')
    plt.plot(x, y2, 'r-', lw=2, label=f'Player 2 Beta({alpha_p2}, {beta_p2})')
    
    # Fill under curve
    plt.fill_between(x, 0, y1, alpha=0.2, color='blue')
    plt.fill_between(x, 0, y2, alpha=0.2, color='red')
    
    plt.title(title)
    plt.xlabel('Draw Result (0 to 1)')
    plt.ylabel('Probability Density')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('distribution_comparison.png')
    print("Saved plot to distribution_comparison.png")

if __name__ == "__main__":
    print("Dreadnaughties - Dynamics Simulation Engine")
    print("-" * 50)
    
    # Baseline: both players have base ship (uniform distribution Beta(1,1))
    print("Scenario 1: Baseline vs Baseline (No components)")
    wr1, wr2 = simulate_battle(1, 1, 1, 1)
    print(f"P1 Win Rate: {wr1*100:.1f}% | P2 Win Rate: {wr2*100:.1f}%")
    
    # Scenario 2: Player 1 has Targeting Computer (+2 Alpha), P2 has nothing
    print("\nScenario 2: P1 (Targeting Computer +2a) vs P2 (Baseline)")
    wr1, wr2 = simulate_battle(3, 1, 1, 1)
    print(f"P1 Win Rate: {wr1*100:.1f}% | P2 Win Rate: {wr2*100:.1f}%")
    
    # Scenario 3: Player 1 has Heavy Armor (+4 Beta), P2 has Targeting (+2 Alpha)
    # Wait, Beta decreases your own mean, right? 
    # Or does Beta represent enemy failure?
    # In a Beta(alpha, beta) distribution, mean = alpha / (alpha + beta)
    # If a component increases BETA, it shifts the curve LEFT (closer to 0).
    # This means high Alpha = good (success), high Beta = bad (failure).
    # So if you equip Armor on your ship, it should probably decrease ENEMY's Alpha, or increase YOUR Alpha (survivability)?
    # We need to define exactly how combat mechanics interact with Alpha/Beta.
    
    # Let's visualize Scenario 2
    plot_distributions(3, 1, 1, 1, title="Aggressive (3,1) vs Baseline (1,1)")
