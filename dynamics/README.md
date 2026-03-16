# Dreadnaughties Dynamics Test Backend

This folder contains the Python simulation environment for designing the Bayesian game mechanics.

## Setup

A virtual environment (`venv`) should be created in this directory to avoid global package conflicts.

```bash
# Initialize the virtual environment
cd dynamics
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install numpy scipy matplotlib
```

## Running Simulations

```bash
python simulate_battles.py
```

This will run Monte Carlo simulations (10,000 battles) and generate a `distribution_comparison.png` graph showing the probability curves of the simulated ships.
