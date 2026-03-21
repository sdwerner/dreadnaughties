import { useGameStore } from '../engine/gameState';
import { getStatContributionBreakdown, calculateDiscreteWinProbability, calculateBetaLimitMean, calculateBetaLimitVariance, BATTLE_ROUNDS, WIN_THRESHOLD_RED_BALLS } from '../engine/calculator';


export function TransparencyPanel() {
  const { baseAlpha, baseBeta, equipped } = useGameStore();
  const { alpha: activeAlpha, beta: activeBeta } = useGameStore(state => state.getActiveStats());
  
  const breakdown = getStatContributionBreakdown(baseAlpha, baseBeta, equipped);

  // Discrete Polya Urn probabilities (the actual game math)
  const strikeWinProb = calculateDiscreteWinProbability(activeAlpha, 1);
  const survivalProb = 1 - calculateDiscreteWinProbability(1, activeBeta);

  // Beta distribution limits (theoretical connection)
  const strikeLimitMean = calculateBetaLimitMean(activeAlpha, 1);
  const survivalLimitMean = calculateBetaLimitMean(1, activeBeta);
  const limitVariance = calculateBetaLimitVariance(activeAlpha, activeBeta);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl mt-6 font-mono text-sm text-slate-300">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <h2 className="text-xl font-bold text-slate-100 uppercase tracking-widest">Engine Transparency</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Stat Breakdown */}
        <div className="space-y-6">
          <div>
            <h3 className="text-slate-400 mb-2 uppercase tracking-wide text-xs">Targeting (Alpha) Accumulator</h3>
            <div className="bg-slate-800 rounded p-3 space-y-2 border border-slate-700/50">
              <div className="flex justify-between">
                <span>Base Alpha</span>
                <span className="text-red-400">{breakdown.alpha.base}</span>
              </div>
              {breakdown.alpha.components.map((c, i) => (
                <div key={i} className="flex justify-between text-slate-400">
                  <span>+ {c.name}</span>
                  <span className="text-red-400">{c.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between font-bold text-slate-200">
                <span>Σ Alpha</span>
                <span className="text-red-400">{breakdown.alpha.total}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-slate-400 mb-2 uppercase tracking-wide text-xs">Armor (Beta) Accumulator</h3>
            <div className="bg-slate-800 rounded p-3 space-y-2 border border-slate-700/50">
              <div className="flex justify-between">
                <span>Base Beta</span>
                <span className="text-blue-400">{breakdown.beta.base}</span>
              </div>
              {breakdown.beta.components.map((c, i) => (
                <div key={i} className="flex justify-between text-slate-400">
                  <span>+ {c.name}</span>
                  <span className="text-blue-400">{c.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between font-bold text-slate-200">
                <span>Σ Beta</span>
                <span className="text-blue-400">{breakdown.beta.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Polya Urn Math + Beta Limit Theory */}
        <div className="space-y-6">
          <div>
            <h3 className="text-slate-400 mb-2 uppercase tracking-wide text-xs">Polya Urn: Strike Success</h3>
            <div className="bg-slate-800 bg-opacity-50 rounded p-3 space-y-2 border border-slate-700/50">
              <div className="text-red-400">P(draw ≥ {WIN_THRESHOLD_RED_BALLS} Red in {BATTLE_ROUNDS} rounds)</div>
              <div className="text-slate-400 text-xs">Urn({activeAlpha} Red, 1 Blue) with reinforcement</div>
              <div className="border-t border-slate-700/50 mt-2 pt-2 flex justify-between">
                <span className="text-slate-200">Exact Win Probability</span>
                <span className="text-red-400 font-bold">{(strikeWinProb * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-slate-400 mb-2 uppercase tracking-wide text-xs">Polya Urn: Survival Rate</h3>
            <div className="bg-slate-800 bg-opacity-50 rounded p-3 space-y-2 border border-slate-700/50">
              <div className="text-blue-400">1 - P(enemy draws ≥ {WIN_THRESHOLD_RED_BALLS} Red in {BATTLE_ROUNDS} rounds)</div>
              <div className="text-slate-400 text-xs">Urn(1 Red, {activeBeta} Blue) with reinforcement</div>
              <div className="border-t border-slate-700/50 mt-2 pt-2 flex justify-between">
                <span className="text-slate-200">Exact Survival Probability</span>
                <span className="text-blue-400 font-bold">{(survivalProb * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded p-4 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.1)]">
             <div className="text-xs text-purple-400 uppercase tracking-widest mb-2">Theoretical Connection: Beta Distribution</div>
             <p className="text-slate-400 text-xs mb-3">
               As rounds → ∞, the Polya Urn converges to Beta(α, β). The limit mean
               serves as an asymptotic reference for the discrete engine.
             </p>
             <div className="space-y-2 text-xs">
               <div className="flex justify-between">
                 <span className="text-slate-300">Strike Limit: Beta({activeAlpha},1) mean</span>
                 <span className="text-purple-400">{strikeLimitMean.result.toFixed(4)}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-300">Survival Limit: 1 - Beta(1,{activeBeta}) mean</span>
                 <span className="text-purple-400">{(1 - survivalLimitMean.result).toFixed(4)}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-300">{limitVariance.equation}</span>
                 <span className="text-purple-400">{limitVariance.result.toFixed(6)}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
