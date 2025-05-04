import { Bar } from "react-chartjs-2";
import React, { useEffect, useState } from "react";

import "../../../../General/General.css";
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

const OptChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received");
      setLoading(false);
      return;
    }

    let techOrders = {};

    data.forEach((item) => {
      const techName = item.Technician || "Unknown";

      if (!techOrders[techName]) {
        techOrders[techName] = 0;
      }
      techOrders[techName] += 1;
    });

    if (Object.keys(techOrders).length > 0) {
      setChartData({
        labels: Object.keys(techOrders),
        
        datasets: [
          {
            label: "Total Orders",
            data: Object.values(techOrders),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartData(null);
    }

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
          label: function (tooltipItem) {
            return `Orders: ${tooltipItem.raw}`;
          },
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
          text: "Total Orders",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart">
      <h2 className="title-text">Orders Requested</h2>
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <Bar className="bar-data" data={chartData} options={options} />
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default OptChart;
