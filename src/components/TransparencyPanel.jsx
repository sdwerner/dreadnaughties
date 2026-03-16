import { useGameStore } from '../engine/gameState';
import { getStatContributionBreakdown, calculateTheoreticalWinProbability, calculateTheoreticalVariance } from '../engine/calculator';
import { cn } from './Shipyard';

export function TransparencyPanel() {
  const { baseAlpha, baseBeta, equipped } = useGameStore();
  const { alpha: activeAlpha, beta: activeBeta } = useGameStore(state => state.getActiveStats());
  
  const breakdown = getStatContributionBreakdown(baseAlpha, baseBeta, equipped);
  const winProb = calculateTheoreticalWinProbability(activeAlpha, activeBeta);
  const variance = calculateTheoreticalVariance(activeAlpha, activeBeta);

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

        {/* Right Col: PDF Math */}
        <div className="space-y-6">
          <div>
            <h3 className="text-slate-400 mb-2 uppercase tracking-wide text-xs">Infinite Limit Mean</h3>
            <div className="bg-slate-800 bg-opacity-50 rounded p-3 space-y-2 border border-slate-700/50">
              <div className="text-purple-400">{winProb.equation}</div>
              <div className="text-slate-500">{winProb.steps}</div>
              <div className="border-t border-slate-700/50 mt-2 pt-2 flex justify-between">
                <span className="text-slate-200">Limit Roll Mean</span>
                <span className="text-purple-400 font-bold">{winProb.result.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-slate-400 mb-2 uppercase tracking-wide text-xs">Infinite Limit Variance</h3>
            <div className="bg-slate-800 bg-opacity-50 rounded p-3 space-y-2 border border-slate-700/50">
              <div className="text-orange-400 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">{variance.equation}</div>
              <div className="text-slate-500 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">{variance.steps}</div>
              <div className="border-t border-slate-700/50 mt-2 pt-2 flex justify-between">
                <span className="text-slate-200">Limit Standard Dev (σ)</span>
                <span className="text-orange-400 font-bold">{Math.sqrt(variance.result).toFixed(4)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/80 rounded p-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
             <div className="text-xs text-indigo-400 uppercase tracking-widest mb-1">Combat Resolution</div>
             <p className="text-slate-300">Success requires <span className="text-green-400 font-bold">&gt;= 3 Red Balls</span> drawn from 5 rounds of the Polya Urn, which conceptually approximates drawing <span className="text-green-400 font-bold">&gt; 0.5000</span> from the <span className="text-indigo-300">Beta({activeAlpha}, {activeBeta})</span> PDF limit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
