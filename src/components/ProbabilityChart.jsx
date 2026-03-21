import { useMemo } from 'react';
import { useGameStore } from '../engine/gameState';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getPolyaUrnDistribution, calculateDiscreteWinProbability, calculateBetaLimitMean, BATTLE_ROUNDS, WIN_THRESHOLD_RED_BALLS } from '../engine/calculator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ProbabilityChart() {
  const alpha = useGameStore((state) => state.getActiveStats().alpha);
  const beta = useGameStore((state) => state.getActiveStats().beta);
  const discreteWinProb = calculateDiscreteWinProbability(alpha, beta);
  const betaLimitMean = calculateBetaLimitMean(alpha, beta).result;

  const data = useMemo(() => {
    const distribution = getPolyaUrnDistribution(alpha, beta);

    return {
      labels: distribution.map(d => `${d.k} Red`),
      datasets: [
        {
          label: 'P(k Red Drawn)',
          data: distribution.map(d => d.probability),
          backgroundColor: distribution.map(d =>
            d.isWin
              ? 'rgba(239, 68, 68, 0.7)'   // red for winning outcomes
              : 'rgba(96, 165, 250, 0.7)'   // blue for losing outcomes
          ),
          borderColor: distribution.map(d =>
            d.isWin
              ? 'rgb(220, 38, 38)'
              : 'rgb(59, 130, 246)'
          ),
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [alpha, beta]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const prob = (context.parsed.y * 100).toFixed(1);
            return `Probability: ${prob}%`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgb(156, 163, 175)',
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${(value * 100).toFixed(0)}%`,
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        }
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#16171d] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Polya Urn Outcome Distribution</h2>
        <span className="text-xs font-mono text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">{BATTLE_ROUNDS}-round draw | win ≥ {WIN_THRESHOLD_RED_BALLS} Red</span>
      </div>
      <div className="h-56 w-full relative">
        <Bar options={options} data={data} />
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block"></span>
            <span className="text-gray-600 dark:text-gray-400">Win (≥ {WIN_THRESHOLD_RED_BALLS} Red)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block"></span>
            <span className="text-gray-600 dark:text-gray-400">Loss (&lt; {WIN_THRESHOLD_RED_BALLS} Red)</span>
          </span>
        </div>
        <div className="text-right space-y-0.5">
          <div className="font-semibold text-gray-700 dark:text-gray-300">Exact Win P: {(discreteWinProb * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Beta({alpha},{beta}) limit mean: {betaLimitMean.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
}
