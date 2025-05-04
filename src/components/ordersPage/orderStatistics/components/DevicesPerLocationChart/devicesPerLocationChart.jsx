import { Pie } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, Legend, Title);

const DevicesPerLocationChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received for Pie Chart");
      return;
    }

    const deviceTotals = {
      "Saint John": 0,
      "Moncton": 0,
      "Fredericton": 0,
      "Purolator": 0,
    };

    data.forEach((item) => {
      const location = item.Location || "Unknown";
      const devices = item.Devices || {};

      const totalDevicesInOrder = Object.values(devices).reduce(
        (sum, qty) => sum + qty,
        0
      );

      if (location.includes("Saint John")) {
        deviceTotals["Saint John"] += totalDevicesInOrder;
      } else if (location.includes("Moncton")) {
        deviceTotals["Moncton"] += totalDevicesInOrder;
      } else if (location.includes("Fredericton")) {
        deviceTotals["Fredericton"] += totalDevicesInOrder;
      } else {
        deviceTotals["Purolator"] += totalDevicesInOrder;
      }
    });

    setChartData({
      labels: ["Saint John", "Moncton", "Fredericton", "Purolator"],
      datasets: [
        {
          data: [
            deviceTotals["Saint John"],
            deviceTotals["Moncton"],
            deviceTotals["Fredericton"],
            deviceTotals["Purolator"],
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",   // Saint John - red
            "rgba(255, 159, 64, 0.6)",   // Moncton - orange
            "rgba(153, 102, 255, 0.6)",  // Fredericton - purple
            "rgba(54, 162, 235, 0.6)",   // Purolator - blue
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true, // Enable tooltips
        callbacks: {
          label: (tooltipItem) => {
            // Custom label content for tooltips
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${label}: ${value} devices`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="title-text">Total Devices Ordered</h2>
      {chartData ? (
        <Pie className="pie-data" data={chartData} options={options}/>

      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default DevicesPerLocationChart;
