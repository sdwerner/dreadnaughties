import { getBetaMean, getBetaVariance } from './betaDistribution';

/**
 * Pure calculator module to expose transparent math operations
 * for both the Polya Urn Simulator and Theoretical Beta Distribution.
 */

export const BATTLE_ROUNDS = 5;

// The win threshold: we require > 50% of the drawn balls to be Red.
// e.g., for 5 rounds, > 2.5 means 3, 4, or 5 Red balls drawn to win.
export const WIN_THRESHOLD_RED_BALLS = 3;

/**
 * Calculates the Beta distribution mean as the theoretical continuous limit.
 * Note: This is NOT the actual win probability in the discrete Polya Urn.
 * As rounds → ∞, the Polya Urn converges to Beta(α, β), so this serves
 * as a useful theoretical reference point.
 */
export function calculateBetaLimitMean(alpha, beta) {
  const expectedMean = getBetaMean(alpha, beta);
  return {
    equation: `limit mean = α / (α + β)`,
    steps: `limit mean = ${alpha} / (${alpha} + ${beta})`,
    result: expectedMean
  };
}

export function calculateBetaLimitVariance(alpha, beta) {
  const variance = getBetaVariance(alpha, beta);
  return {
    equation: `limit variance = (α × β) / ((α + β)² × (α + β + 1))`,
    steps: `limit variance = (${alpha} × ${beta}) / ((${alpha} + ${beta})² × (${alpha} + ${beta} + 1))`,
    result: variance
  };
}

/**
 * Simulates a 5-round Polya Urn combat draw.
 * @param {number} initialAlpha Starting Red balls
 * @param {number} initialBeta Starting Blue balls
 */
export function simulateCombatTurn(initialAlpha, initialBeta) {
  let redBalls = initialAlpha;
  let blueBalls = initialBeta;
  let redDrawn = 0;
  let blueDrawn = 0;
  
  const drawSequence = [];

  for (let i = 0; i < BATTLE_ROUNDS; i++) {
    const totalBalls = redBalls + blueBalls;
    // Math.random() is suitable as a simple frontend placeholder for the MVP
    const roll = Math.random() * totalBalls;
    
    if (roll < redBalls) {
      redBalls++;
      redDrawn++;
      drawSequence.push('Red');
    } else {
      blueBalls++;
      blueDrawn++;
      drawSequence.push('Blue');
    }
  }

  const isVictory = redDrawn >= WIN_THRESHOLD_RED_BALLS;
  const discreteWinProb = calculateDiscreteWinProbability(initialAlpha, initialBeta);
  const betaLimitMean = calculateBetaLimitMean(initialAlpha, initialBeta);
  
  return {
    alpha: initialAlpha,
    beta: initialBeta,
    roll: `${redDrawn} Red vs ${blueDrawn} Blue`,
    result: isVictory ? 'Victory' : 'Defeat',
    timestamp: new Date().toLocaleTimeString(),
    transparentMath: {
      discreteWinProb,
      betaLimitMean,
      betaLimitVariance: calculateBetaLimitVariance(initialAlpha, initialBeta),
      rollThreshold: `>= ${WIN_THRESHOLD_RED_BALLS} Red Drawn for Victory`,
      drawSequence: drawSequence.join(', ')
    }
  };
}

/**
 * Calculates the exact discrete probability of the attacker (Red) winning 
 * a 5-round Polya Urn battle (i.e., drawing >= 3 Red balls in 5 draws).
 */
export function calculateDiscreteWinProbability(alpha, beta) {
  // P(X = k) = C(rounds, k) * [ Γ(alpha+k) * Γ(beta+rounds-k) * Γ(alpha+beta) ] / [ Γ(alpha) * Γ(beta) * Γ(alpha+beta+rounds) ]
  // We can calculate this iteratively without heavy Gamma functions for small rounds like 5
  
  let totalWinProb = 0;
  
  for (let k = WIN_THRESHOLD_RED_BALLS; k <= BATTLE_ROUNDS; k++) {
      totalWinProb += calculatePolyaUrnProbabilityExact(alpha, beta, BATTLE_ROUNDS, k);
  }
  
  return totalWinProb;
}

// Probability of drawing exactly k red balls in n rounds
function calculatePolyaUrnProbabilityExact(alpha, beta, n, k) {
  // C(n, k) 
  const combinations = factorialize(n) / (factorialize(k) * factorialize(n - k));
  
  let num = 1;
  for (let i = 0; i < k; i++) num *= (alpha + i);
  for (let i = 0; i < (n - k); i++) num *= (beta + i);
  
  let den = 1;
  for (let i = 0; i < n; i++) den *= (alpha + beta + i);
  
  return combinations * (num / den);
}

function factorialize(num) {
  if (num === 0 || num === 1) return 1;
  let result = num;
  for (let i = num - 1; i >= 1; i--) {
    result *= i;
  }
  return result;
}

/**
 * Returns the full discrete outcome distribution for the Polya Urn.
 * Array of { k, probability } for k = 0..BATTLE_ROUNDS red balls drawn.
 */
export function getPolyaUrnDistribution(alpha, beta) {
  const distribution = [];
  for (let k = 0; k <= BATTLE_ROUNDS; k++) {
    distribution.push({
      k,
      probability: calculatePolyaUrnProbabilityExact(alpha, beta, BATTLE_ROUNDS, k),
      isWin: k >= WIN_THRESHOLD_RED_BALLS
    });
  }
  return distribution;
}

export function getStatContributionBreakdown(baseAlpha, baseBeta, equippedComponents) {
  const breakdown = {
    alpha: {
      base: baseAlpha,
      components: [],
      total: baseAlpha
    },
    beta: {
      base: baseBeta,
      components: [],
      total: baseBeta
    }
  };

  equippedComponents.forEach(comp => {
    if (comp.dAlpha > 0) {
      breakdown.alpha.components.push({ name: comp.name, value: comp.dAlpha });
      breakdown.alpha.total += comp.dAlpha;
    }
    if (comp.dBeta > 0) {
      breakdown.beta.components.push({ name: comp.name, value: comp.dBeta });
      breakdown.beta.total += comp.dBeta;
    }
  });

  return breakdown;
}
