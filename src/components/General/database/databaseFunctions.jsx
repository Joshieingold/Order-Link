import { endOfWeek, format, startOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance
import { Timestamp, addDoc } from "firebase/firestore";
import { deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
export const fetchOrdersData = async () => { 
    try {
        const deliveryRef = collection(db, "DeliveryTracker");
        const querySnapshot = await getDocs(query(deliveryRef));
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        let orderData = [];
        querySnapshot.forEach((doc) => {
            const order = doc.data();

            const boxes = order.Boxes || 1;
            const dateCompleted = order.DateCompleted && typeof order.DateCompleted.toDate === "function" 
                ? order.DateCompleted.toDate() 
                : new Date(); // Default to current date if not present
            const weight = order.Weight || 0;
            const location = order.Location || "Unknown";
            const orderNumber = order.OrderID || "Unknown";
            const skids = order.Skids || 1/24;
            const techName = order.TechName || "Unknown";
            const waybill = order.Waybill || "Unknown";
            const devices = order.Devices || {};

            orderData.push({
                Boxes: boxes || 1,
                Date: dateCompleted ? dateCompleted : new Date(),
                Weight: weight || 0,
                Location: location,
                OrderID: orderNumber || "Unknown",
                Skids: skids,
                Technician: techName || "Unknown",
                Waybill: waybill || "Unknown",
                Devices: devices || {},
            });
        });
        return orderData;
    }
    catch (error) {
        console.error("Error fetching orders data:", error);
    }
};
export const fetchTempOrdersData = async () => {
    try {
        const deliveryRef = collection(db, "TempOrders");
        const querySnapshot = await getDocs(query(deliveryRef));

        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return [];
        }

        let orderData = [];

        querySnapshot.forEach((doc) => {
            const order = doc.data();

            // Convert Firestore Timestamp to JS Date safely
            const dateCompleted = order.DateCompleted?.toDate?.() ?? console.log("fuck");

            orderData.push({
                Boxes: order.Boxes ?? 1,
                DateCompleted: dateCompleted,
                Weight: order.Weight ?? 0,
                Location: order.Location ?? "Unknown",
                OrderID: order.OrderID ?? "Unknown",
                Skids: order.Skids ?? (1 / 24),
                TechName: order.TechName ?? "Unknown",
                Waybill: order.Waybill ?? "Unknown",
                Devices: order.Devices ?? {},
                Note: order.Note ?? "No note associated with this order."
            });
        });

        return orderData;
    } catch (error) {
        console.error("Error fetching orders data:", error);
        return [];
    }
};
export const fetchTechData = async () => { try {
        const techRef = collection(db, "TechDatabase");
        const querySnapshot = await getDocs(query(techRef));
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        let techData = [];
        querySnapshot.forEach((doc) => {
            const tech = doc.data();
            const techName = tech.Name || "Unknown";
            const location = tech.Location || "Unknown";
            const sendBy = tech.SendingMethod || "Purolator";
            

            techData.push({
                Name : techName || "Unknown",
                Location : location || "Unknown",
                SendingMethod : sendBy || "Purolator",
            });
        });
        return techData;
    }
    catch (error) {
        console.error("Error fetching orders data:", error);
    }
};
export const fetchDeviceData = async () => {
    try {
        const deviceRef = collection(db, "DeviceDatabase");
        const querySnapshot = await getDocs(query(deviceRef));
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        let deviceData = [];
        querySnapshot.forEach((doc) => {
            const device = doc.data();
            const deviceName = device.Name || "Unknown";
            const fullBox = device.FullBox || 10;
            

            deviceData.push({
                Name : deviceName || "Unknown",
                FullBox : fullBox || 10,
            });
        });
        return deviceData;
    }
    catch (error) {
        console.error("Error fetching orders data:", error);
    }
};
export const sendOrderData = async (order) => {
    try {
        const deliveryRef = collection(db, "DeliveryTracker");

        // Construct the order object in the expected Firestore format
        const payload = {
            Boxes: order.Boxes || 1,
            DateCompleted: order.Date instanceof Date ? Timestamp.fromDate(order.Date) : Timestamp.fromDate(new Date()),
            Weight: order.Weight || 0,
            Location: order.Location || "Unknown",
            ID: order.OrderID || "Unknown",
            Skids: order.Skids || 1/24,
            TechName: order.Technician || "Unknown",
            Waybill: order.Waybill || "Unknown",
            Devices: order.Devices || {},
        };

        const docRef = await addDoc(deliveryRef, payload);
        console.log("Order successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding order to database:", error);
        throw error;
    }
};
export const PushPdfDataToTempDatabase = async (order) => {
    try {
        const deliveryRef = collection(db, "TempOrders");

        const devicesMap = {};
        if (Array.isArray(order.devices)) {
            order.devices.forEach(device => {
                const name = device.name;
                const quantity = device.quantity || 0;
                if (name) {
                    devicesMap[name] = quantity;
                }
            });
        }

        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split(/[\/\-]/).map(Number);
            if (!day || !month || !year) return new Date();
            return new Date(year, month - 1, day);
        };

        const payload = {
            Boxes: order.boxes || 1,
            DateCompleted: order.date 
                ? Timestamp.fromDate(order.date instanceof Date ? order.date : parseDate(order.date)) 
                : Timestamp.fromDate(new Date()),
            Weight: order.weight || 0,
            Location: order.location || "Unknown",
            OrderID: order.orderID || "Unknown",
            Skids: order.skids || 1/24,
            TechName: order.name || "Unknown",
            Waybill: order.waybill || "Unknown",
            Devices: devicesMap,
            Note: order.note || "No note associated with this order."
        };

        const docRef = await addDoc(deliveryRef, payload);
        console.log("Order successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding order to database:", error);
        throw error;
    }
};
export const PushPdfDataToPrimaryDatabase = async (order) => {
    try {
        const deliveryRef = collection(db, "DeliveryTracker");

        const devicesMap = {};
        if (Array.isArray(order.devices)) {
            order.devices.forEach(device => {
                const name = device.name;
                const quantity = device.quantity || 0;
                if (name) {
                    devicesMap[name] = quantity;
                }
            });
        }

        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split(/[\/\-]/).map(Number);
            if (!day || !month || !year) return new Date();
            return new Date(year, month - 1, day);
        };

        const payload = {
            Boxes: order.boxes || 1,
            DateCompleted: order.date 
                ? Timestamp.fromDate(order.date instanceof Date ? order.date : parseDate(order.date)) 
                : Timestamp.fromDate(new Date()),
            Weight: order.weight || 0,
            Location: order.location || "Unknown",
            OrderID: order.orderID || "Unknown",
            Skids: order.skids || 1/24,
            TechName: order.name || "Unknown",
            Waybill: order.waybill || "Unknown",
            Devices: devicesMap,
            Note: order.note || "No note associated with this order."
        };

        const docRef = await addDoc(deliveryRef, payload);
        console.log("Order successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding order to database:", error);
        throw error;
    }
};
export const deleteOrderByOrderIdField = async (orderId) => {
 if (!orderId) {
   console.error("No order ID provided");
   return;
 }

 try {
   const q = query(collection(db, "orders"), where("orderId", "==", orderId));
   const querySnapshot = await getDocs(q);

   if (querySnapshot.empty) {
     console.warn(`No documents found with orderId: ${orderId}`);
     return;
   }

   const deletePromises = querySnapshot.docs.map((docSnap) => {
     return deleteDoc(doc(db, "orders", docSnap.id));
   });

   await Promise.all(deletePromises);
   console.log(`Deleted ${deletePromises.length} document(s) with orderId ${orderId}`);
 } catch (error) {
   console.error("Error deleting order(s):", error);
 }
};
export const SubmitTempOrder = async (order) => {
    if (!order) {
        console.log("Not sure how this happened. No order was selected to edit.");
        return;
    }

    try {
        const deliveryRef = collection(db, "DeliveryTracker");

        // Prepare the order object safely
        const sanitizedOrder = {
            ...order,
            DateCompleted: order.DateCompleted
                ? Timestamp.fromDate(new Date(order.DateCompleted))
                : null
        };

        await addDoc(deliveryRef, sanitizedOrder);
        await DeleteTempOrder(order); // Delete the temp order after submission
        console.log("Order successfully added to DeliveryTracker with ID:", order.OrderID);
        
        return;
    } catch (error) {
        console.log("SubmitTempOrder called with:", order);
        console.log("There was an unexpected error:", error);
        return;
    }
}
export const DeleteTempOrder = async (order) => {
    if (!order) {
        console.log("Not sure how this happened. No order was selected to edit.");
        return;
    }
    try {
        const orderQuery = query(
            collection(db, "TempOrders"),
            where("OrderID", "==", order.OrderID)
        );

        const snapshot = await getDocs(orderQuery);

        if (snapshot.empty) {
            console.log("No documents found from query");
            return;
        } else if (snapshot.size > 1) {
            console.log("More than one document found.");
            return; // TEMP
        } else {
            const docRef = snapshot.docs[0].ref;
            await deleteDoc(docRef);
            console.log("Order has been deleted successfully!");
            return;
        }
    }
    catch (error) {
        console.log("DeleteTempOrder called with:", order);
        console.log("There was an unexpected error:", error);
        return;
    }
}
export const ChangeTempOrder = async (order) => {
    if (!order) {
        console.log("Not sure how this happened. No order was selected to edit.");
        return;
    }

    try {
        const orderQuery = query(
            collection(db, "TempOrders"),
            where("OrderID", "==", order.OrderID)
        );

        const snapshot = await getDocs(orderQuery);

        if (snapshot.empty) {
            console.log("No documents found from query");
            return;
        } else if (snapshot.size > 1) {
            console.log("More than one document found.");
            return; // TEMP
        } else {
            const docRef = snapshot.docs[0].ref;

            // Prepare the order object safely
            const sanitizedOrder = {
                ...order,
                DateCompleted: order.DateCompleted
                    ? Timestamp.fromDate(new Date(order.DateCompleted))
                    : null
            };

            await setDoc(docRef, sanitizedOrder);
            console.log("Order has been changed successfully!");
            return;
        }
    } catch (error) {
        console.log("ChangeTempOrder called with:", order);
        console.log("There was an unexpected error:", error);
        return;
    }
};
export const FetchProdData = async (monthName) => {
    try {
        // Normalize month name and get index
        const monthIndex = new Date(`${monthName} 1`).getMonth(); // e.g., "January" → 0
        const currentYear = new Date().getFullYear();

        const deliveryRef = collection(db, "bom-wip");
        const querySnapshot = await getDocs(query(deliveryRef));

        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return [];
        }

        let prodData = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.Date;
            if (timestamp && timestamp.toDate) {
                const date = timestamp.toDate();
                if (date.getMonth() === monthIndex && date.getFullYear() === currentYear) {
                    prodData.push({
                        Date: date,
                        Device: data.Device,
                        Name: data.Name,
                        Quantity: data.Quantity,
                    });
                }
            }
        });

        return prodData;
    } catch (error) {
        console.error("Error fetching bom-wip data:", error);
        return [];
    }
};
export const FetchGoalData = async (monthName) => {
    try {
        // Convert month name to number (1-based string)
        const monthIndex = new Date(`${monthName} 1`).getMonth(); // 0-based
        const monthId = (monthIndex + 1).toString(); // "1" for January, etc.

        const docRef = doc(db, "MonthlyGoals", monthId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("No goals document found for this month.");
            return {};
        }

        const data = docSnap.data(); // This is an object: { DeviceA: 20, DeviceB: 15, ... }
        return data;

    } catch (error) {
        console.error("Error fetching MonthlyGoals data:", error);
        return {};
    }
};