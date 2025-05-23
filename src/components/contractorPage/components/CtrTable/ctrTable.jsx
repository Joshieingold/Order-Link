import { useEffect, useState } from "react";
import { FetchCtrDataForWeek } from "../../../General/database/databaseFunctions";
import "./CtrTable.css"; // You'll create this CSS file
import DataTable from "react-data-table-component";

export const CtrTable = () => {
    const [weekData, setWeekData] = useState([]);
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    useEffect(() => {
        const fetchData = async () => {
            const data = await FetchCtrDataForWeek("2025-03-17", "8052");
            setWeekData(data);
            console.log(data);
        };

        fetchData();
    }, []);

    // Convert weekData to a map keyed by formatted date string
    const weekMap = Object.fromEntries(
        weekData.map((entry) => [
            entry.dateSubmitted.toDate().toISOString().split("T")[0],
            entry
        ])
    );

    const generateWeek = (mondayStr) => {
        const monday = new Date(mondayStr);
        let week = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            week.push(d.toISOString().split("T")[0]);
        }
        return week;
    };

    const thisWeek = generateWeek("2025-03-17");

    return (
        <div className="week-container">
            {thisWeek.map((date, index) => (
                <div className="day-box" key={date}>
                    <div className="day-label">{weekdays[index]}</div>
                    <div className="day-content">
                        {weekMap[date] ? (
                            <pre>{JSON.stringify(weekMap[date], null, 2)}</pre>
                        ) : (
                            <span>No Data</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
