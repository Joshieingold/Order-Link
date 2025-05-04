import React, { useEffect, useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, totalWeight, size } = payload[0].payload;

  return (
    <div className="tooltip-container">
      <p>{`Waybill: ${name}`}</p>
      <p>{`Total Weight: ${totalWeight} kg`}</p>
      <p>{`Associated Boxes: ${size}`}</p>
    </div>
  );
};

const categorizeWaybill = (name) => {
  if (name?.startsWith("STJ")) return "Day&Ross Shipments";
  if (/^\d+$/.test(name)) return "Purolator Shipments";
  if (name?.includes("Pickup")) return "Pickup Orders";
  return "Other";
};

const getColor = (category) => {
  const colorMap = {
    "Day&Ross Shipments": "rgba(255, 123, 0, 0.64)",
    "Purolator Shipments": "rgba(63, 192, 209, 0.69)",
    "Pickup Orders": "rgba(238, 25, 61, 0.49)",
    Other: "#00C49F",
  };
  return colorMap[category] || "#000000";
};

const WaybillTreemap = ({ data }) => {
  const [treemapData, setTreemapData] = useState({ children: [] });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("No valid data received");
      setLoading(false);
      return;
    }

    const filteredData = data.filter((item) => {
      if (!item.Date) return false;
      const itemDate = new Date(item.Date);
      const afterStart = startDate ? itemDate >= new Date(startDate) : true;
      const beforeEnd = endDate ? itemDate <= new Date(endDate) : true;
      return afterStart && beforeEnd;
    });

    if (filteredData.length === 0) {
      setTreemapData({ children: [] });
      setLoading(false);
      return;
    }

    const groupedData = filteredData.reduce((acc, item) => {
      const category = categorizeWaybill(item.Waybill);
      acc[category] = acc[category] || {};
      const waybillId = item.Waybill;

      if (!acc[category][waybillId]) {
        acc[category][waybillId] = {
          name: waybillId,
          size: 0,
          totalWeight: 0,
          fill: getColor(category),
        };
      }

      acc[category][waybillId].size += item.Boxes || 1;
      acc[category][waybillId].totalWeight += item.Weight || 0;

      return acc;
    }, {});

    const structuredTreemapData = {
      name: "Waybills",
      children: Object.keys(groupedData).map((category) => ({
        name: category,
        children: Object.values(groupedData[category]),
      })),
    };

    setTreemapData(structuredTreemapData);
    setLoading(false);
  }, [data, startDate, endDate]);

  return (
    <div className="data-container" style={{ width: "100%", height: "100%" }}>
      <h2 className="title-text" style={{ height: "20%", width: "100%", textAlign: "center" }}>
        Order Visualization
      </h2>
      {loading ? (
        <p>Loading data...</p>
      ) : treemapData.children?.length === 0 ? (
        <p>No data in selected range.</p>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <Treemap
            data={treemapData.children}
            dataKey="size"
            stroke="#fff"
            fill="rgba(255, 255, 255, 0)"
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WaybillTreemap;
