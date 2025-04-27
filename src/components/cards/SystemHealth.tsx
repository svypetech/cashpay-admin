import React, { useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const SystemHealthGauge = ({ value = 75 }) => {
  const chartRef = useRef(null);
  const normalizedValue = Math.min(Math.max(0, value), 100);

  const drawNeedle = (chart: any) => {
    const ctx = chart.ctx;
    const centerX = chart.width / 2;
    const centerY = chart.height - 10;
    const radius = chart.height - 30;
    const angle = ((normalizedValue / 100) * Math.PI) + Math.PI;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * radius * 0.8,
      centerY + Math.sin(angle) * radius * 0.8
    );
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  const data = {
    datasets: [
      {
        data: [normalizedValue, 100 - normalizedValue],
        backgroundColor: ["#3A5AFE", "#E9EDF0"],
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

  const handleDetailsClick = () => {
    console.log("Details clicked");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4" role="heading">
        Overall System Health
      </h2>
      <div className="relative" style={{ height: "100px" }}>
        <Doughnut
          ref={chartRef}
          data={data}
          options={options}
          aria-label={`System health gauge showing ${normalizedValue}%`}
        />
        <div className="flex items-center justify-center absolute inset-0 top-12">
          <span className="text-3xl font-bold text-gray-800">{normalizedValue}</span>
        </div>
      </div>
      <div className="w-full flex justify-center mt-4">
      <button
        onClick={handleDetailsClick}
        className="mt-4 w-48 px-6 py-2 bg-[#D5E5FF] text-[#3A5AFE] rounded-md text-sm font-medium hover:bg-blue-100 transition cursor-pointer"
        aria-label="View system health details"
      >
        Details
      </button>
      </div>
    </div>
  );
};

export default SystemHealthGauge;