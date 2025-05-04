import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "./orderTable.css";

export const OrderTable = ({ data, onRowClick }) => {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    setVisible(true);
  }, []);

  const filteredData = data.filter((row) => {
    const query = searchText.toLowerCase();
    const matchesSearch =
      row.OrderID?.toString().toLowerCase().includes(query) ||
      row.Technician?.toLowerCase().includes(query) ||
      row.Waybill?.toLowerCase().includes(query);

    const orderDate = row.Date ? new Date(row.Date) : null;
    const afterStart = startDate ? orderDate >= new Date(startDate) : true;
    const beforeEnd = endDate ? orderDate <= new Date(endDate) : true;

    return matchesSearch && afterStart && beforeEnd;
  });

  const customStyles = {
    noData: {
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        color: "white",
        padding: "20px",
        transition: "0.8s"
      },
    },
  };

  return (
    <div className={`order-table ${visible ? "fade-in" : ""}`}>
      <div className="filter-bar">
        
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by ID, Tech, or Waybill"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        className="order-table"
        columns={[
          { name: "Order ID", selector: (row) => row.OrderID, sortable: true },
          { name: "Tech Name", selector: (row) => row.Technician, sortable: true },
          {
            name: "Order Date",
            selector: (row) =>
              row.Date?.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) || "N/A",
            sortable: true,
          },
          {
            name: "Total Weight",
            selector: (row) => `${row.Weight} lb`,
            sortable: true,
          },
          { name: "Waybill", selector: (row) => row.Waybill, sortable: true },
          { name: "Boxes Sent", selector: (row) => row.Boxes, sortable: true },
        ]}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        fixedHeader
        paginationPerPage={15}
        paginationRowsPerPageOptions={[15, 50]}
        noDataComponent={<div className="no-data">No matching orders found.</div>}
        customStyles={customStyles}
        onRowClicked={(row) => {
          onRowClick(row);
          setVisible(false); // Hide the table when a row is clicked
        }}
      />
    </div>
  );
};
