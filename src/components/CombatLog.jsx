import { useState } from 'react';
import { useGameStore } from '../engine/gameState';
import { cn } from './Shipyard';

export function CombatLog() {
  const { combatLogs } = useGameStore();
  const [expandedLogId, setExpandedLogId] = useState(null);

  const toggleMath = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#16171d] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Combat Log</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">Recent 5-Round Polya's Urn Encounters</div>
      </div>

      <div className="space-y-4">
        {combatLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
            No combat logs yet. Equip your ship and open the Transparency Panel to simulate an attack!
          </div>
        ) : (
          combatLogs.map((log) => (
            <div 
              key={log.id} 
              className={cn(
                "flex flex-col p-4 rounded-lg border transition-all",
                log.result === 'Victory' 
                  ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50" 
                  : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</span>
                  <span className="font-mono text-xs text-gray-400 dark:text-gray-500">Urn: {log.alpha} Red, {log.beta} Blue | Exact Win P: {(log.transparentMath.discreteWinProb * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Drawn</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{log.roll}</div>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-md font-bold text-sm",
                    log.result === 'Victory' 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {log.result}
                  </div>
                  <button 
                    onClick={() => toggleMath(log.id)}
                    className="text-gray-400 hover:text-indigo-500 transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer"
                    title="View Raw Math"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                  </button>
                </div>
              </div>
              
              {/* Expandable Raw Math Details */}
              {expandedLogId === log.id && log.transparentMath && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-[#101115] p-3 rounded">
                   <div className="mb-2"><span className="text-indigo-500">Draw Sequence:</span> {log.transparentMath.drawSequence}</div>
                   <div className="mb-2"><span className="text-indigo-500">Win Criteria:</span> {log.transparentMath.rollThreshold}</div>
                   <div className="mb-1"><span className="text-green-500">Exact Win P:</span> {(log.transparentMath.discreteWinProb * 100).toFixed(2)}%</div>
                   <div className="mb-2 ml-4 text-gray-500">P(draw ≥ 3 Red in 5 rounds) from Polya Urn({log.alpha}, {log.beta})</div>
                   <div className="mb-1"><span className="text-purple-500">Beta Limit Mean:</span> {log.transparentMath.betaLimitMean.equation}</div>
                   <div className="mb-2 ml-4 text-gray-500">=&gt; {log.transparentMath.betaLimitMean.steps} = {log.transparentMath.betaLimitMean.result.toFixed(4)}</div>
                   <div className="mb-1"><span className="text-orange-500">Beta Limit Variance:</span> {log.transparentMath.betaLimitVariance.equation}</div>
                   <div className="ml-4 text-gray-500">=&gt; {log.transparentMath.betaLimitVariance.steps} = {log.transparentMath.betaLimitVariance.result.toFixed(4)}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
