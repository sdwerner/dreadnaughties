/**
 * Generates a random number from a normal distribution using Box-Muller transform
 */
function randomNormal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Generates a random number from a Gamma distribution
 * using Marsaglia and Tsang method (1900+)
 * @param {number} a - shape parameter (alpha/beta)
 */
function randomGamma(a) {
  if (a < 1) {
    // Ahrens-Dieter method for a < 1
    const u = Math.random();
    return randomGamma(1.0 + a) * Math.pow(u, 1.0 / a);
  }
  
  const d = a - 1.0 / 3.0;
  const c = 1.0 / Math.sqrt(9.0 * d);
  
  while (true) {
    let x, v;
    do {
      x = randomNormal();
      v = 1.0 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    const u = Math.random();
    
    // Squeeze testing
    const x2 = x * x;
    if (u < 1.0 - 0.0331 * x2 * x2) return d * v;
    
    if (Math.log(u) < 0.5 * x2 + d * (1.0 - v + Math.log(v))) return d * v;
  }
}

/**
 * Generates a random number from a Beta(alpha, beta) distribution
 * Uses the property: B = X / (X + Y) where X ~ Gamma(alpha, 1) and Y ~ Gamma(beta, 1)
 */
export function randomBeta(alpha, beta) {
  const x = randomGamma(alpha);
  const y = randomGamma(beta);
  return x / (x + y);
}

/**
 * Calculates the theoretical mean of Beta(alpha, beta)
 */
export function getBetaMean(alpha, beta) {
  return alpha / (alpha + beta);
}

/**
 * Calculates theoretical variance
 */
export function getBetaVariance(alpha, beta) {
  return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
}
