import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const OrdersPerDayChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received for Line Chart:", data);
      return;
    }

    const orderCounts = {};

    data.forEach((item, i) => {
      let dateValue = item.DateCompleted || item.CompletedDate || item.Date;

      if (!dateValue) {
        console.warn(`Skipping: no timestamp at index ${i}`, item);
        return;
      }

      let dateObj;

      if (dateValue instanceof Date) {
        dateObj = dateValue;
      } else if (typeof dateValue === "object" && dateValue.seconds) {
        dateObj = new Date(dateValue.seconds * 1000);
      } else {
        console.warn(`Skipping: unknown date format at index ${i}`, item);
        return;
      }

      const formattedDate = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      orderCounts[formattedDate] = (orderCounts[formattedDate] || 0) + 1;
    });

    const sortedDates = Object.keys(orderCounts).sort();
    const counts = sortedDates.map((date) => orderCounts[date]);

    console.log("Processed Order Counts:", orderCounts);

    if (sortedDates.length === 0) {
      console.warn("No valid dates were parsed.");
      return;
    }

    setChartData({
      labels: sortedDates,
      datasets: [
        {
          label: "Orders Completed",
          data: counts,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3,
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false},
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} orders`,
        },
      },
      title: {
        display: false,
        text: "Orders Completed Per Day",
      },
    },
    scales: {
      x: {
        title: { display: false, text: "Date" },
        display: false,
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Orders" },
        precision: 0,
      },
    },
  };

  return (
    <div className="chart-container" style={{padding: "0.5rem"}}>
      <h2 className="title-text" style={{height:"10%"}}>Orders Completed Per Day</h2>
      {chartData ? (
        <Line data={chartData} options={options} style={{height: "90%"}}/>
      ) : (
        <p>Loading or no valid chart data.</p>
      )}
    </div>
  );
};

export default OrdersPerDayChart;
