
import { useState, useEffect, act, Suspense } from "react";
import { Navbar } from "../../General/navbar/navbar";
import OrdersNavbar from "../orderStatistics/components/ordersNavbar/ordersNavbar";
import { ActiveOrder } from "./Components/activeOrder/activeOrder";
import { DeleteTempOrder, fetchTempOrdersData, PushPdfDataToPrimaryDatabase, PushPdfDataToTempDatabase, SubmitTempOrder } from "../../General/database/databaseFunctions";
import { MiniOrder } from "./Components/miniOrder/miniOrder";
import { AnimatePresence, motion } from 'framer-motion';
import { EditOrder } from "./Components/activeOrder/activeOrder";
import { ChangeTempOrder } from "../../General/database/databaseFunctions";
import { PdfParse } from "./Components/PdfParse/pdfParse";
import "./orderReview.css";
import { se } from "date-fns/locale";
export const OrderReview = () => {
    const [pdfData, setPdfData] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [orderData, setOrderData] = useState([]); // Initialize orderData with an empty array
    const [isEditing, setIsEditing] = useState(false);
    const handleParsedData = (parsedResults) => {
        console.log("Parsed Results:", parsedResults);
        setPdfData(parsedResults); // Or whatever you want to do with it
        for (let i = 0; i < parsedResults.length; i++) {
            if ((parsedResults[i]).requireReview == true) {
                PushPdfDataToTempDatabase(parsedResults[i]);
                console.log(parsedResults[i].orderID, " pushed to temporary database");
            }
            else {
                PushPdfDataToPrimaryDatabase(parsedResults[i]);
                console.log(parsedResults[i].orderID, " pushed to primary database");
            }
        }
        RefreshData(); // Refresh data after pushing to database
    };
    // Function to fetch data
    const RefreshData = async () => {
        const data = await fetchTempOrdersData();
        setOrderData(data); // Set the fetched data to orderData state
    };
    const HandleMiniContainerClick = (doc) => {
        setActiveOrder(doc)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const UpdateActiveOrder = async (orderRef) => {
        await ChangeTempOrder(activeOrder);
        setIsEditing(false); // Reset editing state
        RefreshData(); // Refresh data after update
    }
    const HandleSubmitOrder = async () => {
        await SubmitTempOrder(activeOrder);
        setActiveOrder(null); // Reset active order after submission
        setIsEditing(false); // Reset editing state
        RefreshData(); // Refresh data after submission
    }
    const handleDeleteOrder = async () => {
        await DeleteTempOrder(activeOrder);
        setActiveOrder(null); // Reset active order after deletion
        setIsEditing(false); // Reset editing state
        RefreshData(); // Refresh data after deletion
    } 
    useEffect(() => {
        RefreshData(); // Fetch data when the component mounts
    }, []); // Empty dependency array means this runs once on mount

    return (
        <motion.div className="order-review-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} >
            <Navbar />
            <OrdersNavbar />
            <div className="header-button-container">
                <h1 className="main-title-text">Order Review</h1>
                 <PdfParse onParsed={handleParsedData} />
            </div>
            <div className="active-order-container">
                <AnimatePresence mode="wait">
                    {activeOrder ? (
                    <motion.div key={activeOrder.OrderID} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="motion-full" >
                        {isEditing ? (
                            <EditOrder orderData={activeOrder} setOrderData={setActiveOrder}/>
                        ) : (
                        <ActiveOrder orderData={activeOrder} /> 
                        )}
                        {isEditing ? (
                            <div className="order-button-container">
                                <button className="active-order-button" onClick={async () => await UpdateActiveOrder(activeOrder)}>Update</button>
                                <button className="active-order-button" onClick={async () => await HandleSubmitOrder(activeOrder)}>Submit</button>
                            </div>
                        ): (
                            <div className="order-button-container">
                                <button className="active-order-button" onClick={() => setActiveOrder(null)}>X</button>
                                <button className="active-order-button" onClick={() => setIsEditing(true)}>Edit</button>
                                <button className="active-order-button" onClick={() => handleDeleteOrder(activeOrder)}>Delete</button>
                                <button className="active-order-button" onClick={async () => await HandleSubmitOrder(activeOrder)}>Submit</button>
                        </div>
                        )}
                        
                    </motion.div>
                    ) : (
                    <motion.p key="no-order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >
                        Select an order to review
                    </motion.p>
                    )}
                </AnimatePresence>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
            <div className="mini-order-container">
                {orderData.map((doc, index) => (
                    <MiniOrder key={index} doc={doc} onClick={() => {HandleMiniContainerClick(doc)}} isActive={activeOrder && doc.OrderID === activeOrder.OrderID}/>
                ))}
            </div>
            </Suspense>
        </motion.div>
    );
};

      

