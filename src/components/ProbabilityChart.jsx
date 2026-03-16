import { useMemo } from 'react';
import { useGameStore } from '../engine/gameState';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { calculateTheoreticalWinProbability } from '../engine/calculator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Very basic approximation of Beta PDF for visualization purposes
// In a full app, we'd use a math library (like mathjs) or a custom Gamma approximation
function approximateBetaPDF(x, alpha, beta) {
  if (x === 0 || x === 1) return 0;
  // This is a rough estimation of the curve shape, omitting the full Beta function coefficient
  return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1);
}

export function ProbabilityChart() {
  const alpha = useGameStore((state) => state.getActiveStats().alpha);
  const beta = useGameStore((state) => state.getActiveStats().beta);
  const mean = calculateTheoreticalWinProbability(alpha, beta).result;

  const data = useMemo(() => {
    const labels = [];
    const points = [];
    
    // Generate 50 points between 0 and 1
    for (let i = 0; i <= 50; i++) {
      const x = i / 50;
      labels.push(x.toFixed(2));
      points.push(approximateBetaPDF(x, alpha, beta));
    }

    // Normalize points so the chart looks consistent
    const max = Math.max(...points) || 1;
    const normalizedPoints = points.map(p => p / max);

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: `Beta(${alpha}, ${beta}) Limit`,
          data: normalizedPoints,
          borderColor: 'rgb(170, 59, 255)',
          backgroundColor: 'rgba(170, 59, 255, 0.2)',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
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
        enabled: false,
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: mean.toFixed(2),
            xMax: mean.toFixed(2),
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            borderDash: [5, 5],
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { maxTicksLimit: 5 }
      },
      y: {
        display: false, // Hide Y axis as it's just relative probability density
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#16171d] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Theoretical Probability Curve</h2>
        <span className="text-xs font-mono text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">Beta(α, β) infinite limit</span>
      </div>
      <div className="h-48 w-full w-full relative">
        <Line options={options} data={data} />
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>0 (Total Failure Limit)</span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">Expected Limit Average: {mean.toFixed(2)}</span>
        <span>1 (Perfect Success Limit)</span>
      </div>
    </div>
  );
}
