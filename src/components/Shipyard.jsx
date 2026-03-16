import { useGameStore } from '../engine/gameState';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getBetaMean } from '../engine/betaDistribution';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Shipyard() {
  const { inventory, equipped, equipComponent, unequipComponent, baseAlpha, baseBeta } = useGameStore();

  const activeAlpha = useGameStore((state) => state.getActiveStats().alpha);
  const activeBeta = useGameStore((state) => state.getActiveStats().beta);
  const mean = getBetaMean(activeAlpha, activeBeta);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#16171d] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Col: Ship Stats */}
        <div className="flex-1 space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Your Dreadnaughtie</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Equip components to modify your combat distribution.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Targeting (Alpha)</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeAlpha}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Armor (Beta)</div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{activeBeta}</div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
             <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Theoretical Win Rate</div>
             <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">{(mean * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Right Col: Equipment */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Available Components</h3>
          <div className="space-y-3">
            {inventory.map((item) => {
              const isEquipped = equipped.find((i) => i.id === item.id);
              return (
                <div 
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                    isEquipped 
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" 
                      : "bg-white border-gray-200 dark:bg-[#16171d] dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  )}
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-3 mt-1">
                      {item.dAlpha > 0 && <span className="text-blue-600 dark:text-blue-400">+{item.dAlpha} Alpha</span>}
                      {item.dBeta > 0 && <span className="text-red-600 dark:text-red-400">+{item.dBeta} Beta</span>}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => isEquipped ? unequipComponent(item.id) : equipComponent(item.id)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isEquipped 
                        ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" 
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {isEquipped ? 'Unequip' : 'Equip'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
