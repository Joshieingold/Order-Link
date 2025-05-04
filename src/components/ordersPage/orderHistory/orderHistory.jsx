import "./orderHistory.css";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { Navbar } from "../../General/navbar/navbar";
import { OrderTable } from "./components/orderTable";
import { useState, useEffect, useRef } from "react";
import { fetchOrdersData } from "../../General/database/databaseFunctions";
import * as XLSX from "xlsx";

export const OrderHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrdersData();
        setData(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Close modal on Escape key or click outside
  useEffect(() => {
    if (!selectedOrder) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedOrder(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOrder]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "OrderHistory.xlsx");
  };

  return (
    <div className="order-history-page">
      <Navbar />
      <OrdersNavbar />

      <div className={`order-history-wrapper ${fadeIn ? "fade-in" : ""}`}>
        <div className="order-history-header">
          <h1 className="main-title-text">Order History</h1>
          <button className="export-button" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>

        <OrderTable data={data} onRowClick={setSelectedOrder} />

        {selectedOrder && (
          <div className="order-modal">
            <div className="order-modal-content" ref={modalRef}>
              <h2>Order Details</h2>
              <div className="order-details-grid">
                <p><strong>Order ID:</strong> {selectedOrder.OrderID}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.Date).toLocaleDateString()}</p>
                <p><strong>Technician:</strong> {selectedOrder.Technician}</p>
                <p><strong>Location:</strong> {selectedOrder.Location}</p>
                <p><strong>Waybill:</strong> {selectedOrder.Waybill}</p>
                <p><strong>Weight:</strong> {selectedOrder.Weight} lb</p>
                <p><strong>Skids:</strong> {selectedOrder.Skids}</p>
                <p><strong>Boxes:</strong> {selectedOrder.Boxes}</p>

                {selectedOrder.Devices && (
                  <div className="device-section">
                    <strong>Devices:</strong>
                    <ul>
                      {Object.entries(selectedOrder.Devices).map(([device, count]) => (
                        <li key={device}>{device}: {count}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
