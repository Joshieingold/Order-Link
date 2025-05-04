import { Pie } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import "./totalDevicesPieChart.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DevicePieChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  const darkColors = [
    "#1f2937",
    "#4b5563",
    "#6b21a8",
    "#7c3aed",
    "#059669",
    "#10b981",
    "#991b1b",
    "#b91c1c",
    "#c2410c",
    "#d97706",
    "#065f46",
    "#0f766e",
  ];

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const deviceCounts = {};
    data.forEach((item) => {
      const devices = item.Devices || {};
      Object.entries(devices).forEach(([device, qty]) => {
        deviceCounts[device] = (deviceCounts[device] || 0) + qty;
      });
    });

    const labels = Object.keys(deviceCounts);
    const values = Object.values(deviceCounts);

    setChartData({
      labels,
      datasets: [
        {
          label: "Devices",
          data: values,
          backgroundColor: labels.map(
            (_, i) => darkColors[i % darkColors.length]
          ),
          borderColor: "rgba(255,255,255,0.2)",
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          display: false,
        },
      },
      title: {
        display: false,
        text: "Devices Ordered By Type",
        color: "white",
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "white",
        bodyColor: "white",
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="title-text">Device Types Ordered</h2>
      {chartData ? (
        <Pie className="pie-data" data={chartData} options={options} />
      ) : (
        <p style={{ color: "white" }}>No data available.</p>
      )}
    </div>
  );
};

export default DevicePieChart;
