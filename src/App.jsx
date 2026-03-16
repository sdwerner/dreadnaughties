import { Shipyard } from './components/Shipyard';
import { CombatLog } from './components/CombatLog';
import { ProbabilityChart } from './components/ProbabilityChart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center pb-8 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Dreadnaughties
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A minimalist Bayesian combat simulator. Equip components to shift your probability distribution and conquer.
          </p>
        </div>
        
        <Shipyard />
        <ProbabilityChart />
        <CombatLog />
      </div>
    </div>
  );
}

export default App;
