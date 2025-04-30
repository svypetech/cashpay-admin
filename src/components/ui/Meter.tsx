import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

// Custom plugin to draw the unfilled arc thinner
ChartJS.register({
  id: 'thinUnfilledArc',
  beforeDatasetDraw(chart, args, pluginOptions) {
      const meta = chart.getDatasetMeta(0);
      // Update only the unfilled arc (assumed to be data index 1)
      meta.data.forEach((arc, index) => {
          if (index === 1) {
              const globalOuter = arc.outerRadius;
              // Set thickness = 0.05 * globalOuter, centered at 0.875 * globalOuter:
              
              // arc.innerRadius = globalOuter * 0.85;
          }
      });
  },
});

interface SystemHealthGaugeProps {
  value?: number;
}

const SystemHealthGauge: React.FC<SystemHealthGaugeProps> = ({ 
  value = 30
}) => {
  const chartRef = useRef<any>(null);
  const normalizedValue = Math.min(Math.max(0, value), 100);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.canvas.parentNode.style.height = '150px';
      chart.canvas.parentNode.style.width = '100%';
    }
  }, []);

  const data = {
    datasets: [
      {
        data: [normalizedValue, 100 - normalizedValue],
        backgroundColor: ["#4169FE", "#EDF1F7"],
        borderWidth: 0,
        circumference: 180,
        rotation: -90,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: { display: false },
    },
    cutout: "75%",
    events: [],
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <Doughnut
        ref={chartRef}
        data={data}
        options={options}
       
      />
      <div className="flex items-end justify-center absolute inset-5">
        <span className="text-3xl font-bold text-gray-800">{normalizedValue}</span>
      </div>
    </div>
  );
};

export default SystemHealthGauge;