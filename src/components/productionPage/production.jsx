import { use, useEffect, useState } from "react";
import { Navbar } from "../General/navbar/navbar";
import { FetchGoalData, FetchProdData } from "../General/database/databaseFunctions";
import "./production.css";
import { TotalRequirements } from "./Components/TotalRequirements/totalRequirements";
import { ProductionLineChart } from "./Components/ProductionLineChart/productionLineChart";
import { ProductionByPersonChart } from "./Components/ProductionPerPersonChart/productionPerPersonChart";
import { DeviceGoalPanel } from "./Components/DeviceGoalPanel/deviceGoalPanel";
export const ProductionPage = () => {
    const [prodData, setProdData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [goalData, setGoalData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("April");

    useEffect(() => {
        const fetchData = async () => {
            const result = await FetchProdData(selectedMonth);
            setProdData(result);
            const goalResult = await FetchGoalData(selectedMonth);
            setGoalData(goalResult);
            console.log("Production Data: ", result);
            console.log("Goal Data: ", goalResult);
            setLoading(false);
        };
        fetchData();
    }, []);
    return (
        <div className="production-page">
            <Navbar />
            <div className="header-container">
                <h1 className="production-page-title">Production for {selectedMonth}</h1>
                {/* month picker component */}
            </div>
    
            {loading ? (
                <p>Loading...</p>
            ) : (
               <div className="charts-container">
                    <div className="main-stats-container">
                        <div className="two-stats-container">
                            <div className="square-bubble">
                                <TotalRequirements prodData={prodData} goalData={goalData} />
                            </div>
                            <div className="rectangle-bubble">
                                <ProductionByPersonChart prodData={prodData} />
                            </div>
                        </div>
                        <div className="one-stats-container">
                            <div className="rectangle-bubble">
                                {!loading && <ProductionLineChart prodData={prodData} />}
                            </div>
                        </div>
                    </div>
                    <div className="device-goal-container">
                        <div className="device-stat-box">
                            <DeviceGoalPanel prodData={prodData} goalData={goalData} />
                        </div>
                    </div>
               </div>
            )}
    
            
        </div>
    );
}