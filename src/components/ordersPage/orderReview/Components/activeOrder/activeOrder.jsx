import { use, useEffect } from "react";
import { toDate } from "date-fns";
import { Timestamp } from "firebase/firestore";
import "./activeOrder.css";

export const ActiveOrder = ({ orderData, submitFunction } ) => {
    return (
        <div className="active-order-main">
            <div className="active-order">
                <div className="info-container-order">
                    <h2>ID: {orderData.OrderID}</h2>
                    <h2 className="border-title">Name: {orderData.TechName}</h2>
                    <p>Location: {orderData.Location}</p>
                    <p>Waybill: {orderData.Waybill}</p>
                    <p>Boxes: {orderData.Boxes}</p>
                    <p>Skids: {orderData.Skids}</p>
                    <p>Date Completed: {new Date(orderData.DateCompleted).toLocaleDateString()}</p>
                </div>
                <div className="device-info-container">
                    
                    <ul>
                        <h2 className="border-title">Devices</h2>
                        {orderData.Devices
                            ? Object.entries(orderData.Devices).map(([deviceName, count]) => (
                                <li key={deviceName}>
                                    {deviceName}: {count}
                                </li>
                            ))
                            : <li>No devices found</li>}
                    </ul>
                </div>
            </div>
            <div className="note-section">
                <p>{orderData.Note}</p>
            </div>
        </div>
    );
};

export const EditOrder = ({ orderData, setOrderData }) => {
    const extractDateOnly = (rawDateString) => {
        const date = new Date(rawDateString);
        return date.toISOString().split('T')[0]; // "2025-02-09"
    };
    const CalendarToFirestore = (dateString) => {
        return Timestamp.fromDate(new Date(dateString));
    };

    const RawDate = orderData.Date
    const FireStoreDate = CalendarToFirestore(RawDate);
    const NormalizedDate = extractDateOnly(orderData.DateCompleted);  // This is the "YYYY-MM-DD" format

    const onChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleDeviceChange = (deviceKey, field, value) => {
        setOrderData((prevData) => {
            const updatedDevices = { ...prevData.Devices };
    
            if (field === "deviceName") {
                const count = updatedDevices[deviceKey];
                delete updatedDevices[deviceKey];
                updatedDevices[value] = count;
            } else if (field === "count") {
                updatedDevices[deviceKey] = Number(value);
            }
    
            return {
                ...prevData,
                Devices: updatedDevices,
            };
        });
    };

    return (
        <div className="active-order-main">
            <div className="active-order">
                <div className="info-container-order">
                    <h2>ID: {orderData.OrderID}</h2>
                    <div className="order-input-container">
                        <h2>Name:</h2>
                        <input className="input-box"name="TechName" value={orderData.TechName} onChange={onChange}/>
                    </div>

                    <div className="order-input-container">
                        <p>Location:</p>
                        <input className="input-box" name="Location" value={orderData.Location} onChange={onChange}/>
                    </div>

                    <div className="order-input-container">
                        <p>Waybill:</p>
                        <input className="input-box" name="Waybill" value={orderData.Waybill} onChange={onChange} />
                    </div>

                    <div className="order-input-container">
                        <p>Boxes:</p>
                        <input className="input-box" name="Boxes" type="number" value={orderData.Boxes} onChange={onChange}/>
                    </div>

                    <div className="order-input-container">
                        <p>Skids:</p>
                        <input className="input-box" name="Skids" type="number"value={orderData.Skids} onChange={onChange} />
                    </div>

                    <div className="order-input-container">
                        <p>Date Completed:</p>
                        <input 
                            className="input-box" name="DateCompleted" type="date" value={NormalizedDate} onChange={onChange}/>
                    </div>
                </div>

                <div className="device-info-container">
                    <ul>
                        <h2 className="border-title">Devices</h2>
                        {Object.entries(orderData.Devices).map(([deviceName, count]) => (
                            <li key={deviceName}>
                                <input
                                    value={deviceName}
                                    onChange={(e) => handleDeviceChange(deviceName, "deviceName", e.target.value)}
                                    className="input-box"
                                />
                                <input
                                    type="number"
                                    value={count}
                                    onChange={(e) => handleDeviceChange(deviceName, "count", e.target.value)}
                                    className="input-box"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="note-section">
                <p>{orderData.Note}</p>
            </div>
        </div>
    );
};



