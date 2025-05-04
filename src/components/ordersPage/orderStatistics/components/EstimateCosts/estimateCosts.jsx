import React, { useState, useEffect } from "react";

export const EstimateCosts = ({ data }) => {
  const [purolatorCosts, setPurolatorCosts] = useState(0);
  const [dayAndRossCosts, setDayAndRossCosts] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);

  const estimatePurolatorGroundRate = (weightKg, distanceKm = 500) => {
    const baseRate = 12.0;
    const extraRatePerKg = 1.5;
    const fuelSurchargeRate = 0.18;
    const distanceMultiplier = distanceKm > 1000 ? 1.5 : 1;

    const totalWeightRate =
      weightKg <= 1 ? baseRate : baseRate + (weightKg - 1) * extraRatePerKg;
    const subtotal = totalWeightRate * distanceMultiplier;
    const fuelSurcharge = subtotal * fuelSurchargeRate;
    const total = subtotal + fuelSurcharge;

    return parseFloat(total.toFixed(2));
  };

  const calculateDayAndRossCost = (totalWeight) => {
    if (totalWeight <= 50) {
      return totalWeight * 3.0;
    } else {
      return 50 * 3.0 + (totalWeight - 50) * 2.5;
    }
  };

  useEffect(() => {
    let purolatorTotal = 0;
    let dayAndRossTotal = 0;

    data.forEach((document) => {
      if (document.Waybill) {
        if (/^\d+$/.test(document.Waybill)) {
          purolatorTotal += estimatePurolatorGroundRate(document.Weight);
        } else if (document.Waybill.startsWith("STJ")) {
          dayAndRossTotal += calculateDayAndRossCost(document.Weight);
        }
      }
    });

    setPurolatorCosts(purolatorTotal);
    setDayAndRossCosts(dayAndRossTotal);
    setTotalCosts(purolatorTotal + dayAndRossTotal);
  }, [data]);

  return (
    <div className="estimate-costs-container">
        <h2 className="title-text" style={{marginBottom: "20px"}}>Estimated Costs</h2>
        <div className="estimate-container">
            <p>Purolator: ${purolatorCosts.toFixed(2)}</p>
            <p>Day&Ross: ${dayAndRossCosts.toFixed(2)}</p>
        </div>      
      <h4 style={{fontWeight: "bold", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center"}}>Total Costs: ${totalCosts.toFixed(2)}</h4>
    </div>
  );
};


