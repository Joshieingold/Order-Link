import { Bar } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const DptChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received");
      setLoading(false);
      return;
    }

    let techDevices = {};

    data.forEach((item) => {
      const techName = item.Technician || "Unknown";
      const devices = item.Devices || {};

      if (!techDevices[techName]) {
        techDevices[techName] = 0;
      }

      Object.values(devices).forEach((quantity) => {
        techDevices[techName] += quantity;
      });
    });

    setChartData({
      labels: Object.keys(techDevices),
      datasets: [
        {
          label: "Total Devices Received",
          data: Object.values(techDevices),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    });

    setLoading(false);
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // <-- this hides the legend
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Devices: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Devices Recieved",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart">
      <h2 className="title-text">Devices Received</h2>
      {loading ? <p>Loading...</p> : chartData && <Bar className="bar-data" data={chartData} options={options} />}
    </div>
  );
};

export default DptChart;
