import { useGameStore } from '../engine/gameState';
import { cn } from './Shipyard';

export function CombatLog() {
  const { combatLogs, simulateCombat } = useGameStore();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#16171d] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Combat Simulator</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Draw from your current Beta probability distribution.</p>
        </div>
        <button
          onClick={simulateCombat}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow transition-colors"
        >
          Simulate Combat Roll
        </button>
      </div>

      <div className="space-y-3">
        {combatLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed rounded-lg border-gray-300 dark:border-gray-800">
            No combats simulated yet. Equip components and roll!
          </div>
        ) : (
          combatLogs.map((log) => (
            <div 
              key={log.id} 
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                log.result === 'Victory' 
                  ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50" 
                  : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50"
              )}
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</span>
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500">Beta({log.alpha}, {log.beta}) | Expected Mean: {log.expectedMean}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Roll Result</div>
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
