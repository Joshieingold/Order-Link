import React from 'react';
import pdfToText from 'react-pdftotext';
import { fetchTechData } from '../../../../General/database/databaseFunctions';
import './pdfParse.css';
export const PdfParse = ({ onParsed }) => {

    const GetRevelevantData = (text, start, end) => {
        const beforeIndex = text.slice(text.indexOf(start) + start.length);
        const afterIndex = beforeIndex.slice(0, beforeIndex.indexOf(end));
        return afterIndex.trim();
    };

    const EstimateDevicesAndWeight = (deviceLst) => {
        const boxSizes = {
            "CGM4981COM": 8, "CGM4331COM": 8, "TG4482A": 8,
            "SCXI11BEI": 10, "IPTVARXI6HD": 10, "IPTVTCXI6HD": 10,
            "SCXI11BEI-ENTOS": 10, "XS010XQ": 12, "XE2SGROG1": 24,
            "CODA5810": 5
        };

        const weights = {
            "CGM4981COM": 4.16, "CGM4331COM": 3.64, "TG4482A": 3.64,
            "SCXI11BEI": 1.4, "IPTVARXI6HD": 1.8, "IPTVTCXI6HD": 1.8,
            "SCXI11BEI-ENTOS": 1.4, "XS010XQ": 1.38, "XE2SGROG1": 0.86,
            "CODA5810": 3.15
        };

        let totalBoxes = 0, totalWeight = 0;
        for (let item of deviceLst) {
            const boxSize = boxSizes[item.name] ?? 15;
            const weight = weights[item.name] ?? 2.33;
            totalBoxes += Math.ceil(item.quantity / boxSize);
            totalWeight += item.quantity * weight;
        }

        const skids = totalBoxes / 24;
        return [Math.max(totalBoxes, 1), totalWeight, skids];
    };

    const GetNameAndLocation = (text) => {
        const relevantText = GetRevelevantData(text, "Saint John,NB,E2R 1A6,CANADA", "Load Number:");
        const techNameMatch = relevantText.match(/([A-Za-z]+ [A-Za-z]+)/);
        const techName = techNameMatch?.[0] ?? "Unknown";
        const locationText = relevantText.replace(techName, "").trim().replace(/^,?\s*/, "");
        return [techName, locationText];
    };

    const ReviewData = (data, techData) => {
        let flag = false, note = "";

        if (techData.Name.toLowerCase().includes(data.name.toLowerCase())) {
            data.location = techData.Location;
        } else {
            flag = true;
            note += "Tech Not in Database. ";
        }

        const loc = data.location.toLowerCase();
        if (loc.includes("saint")) {
            if (!data.waybill.includes("Pickup")) {
                flag = true;
                note += "Waybill Unexpected. ";
            } else {
                data.waybill = "PickupSJ";
            }
        } else if (loc.includes("moncton") || loc.includes("fredericton")) {
            if (!data.waybill.includes("STJ")) {
                flag = true;
                note += "Waybill Unexpected. ";
            }
        } else {
            if (isNaN(Number(data.waybill))) {
                flag = true;
                note += "Waybill Unexpected. ";
            }
        }

        if (isNaN(Number(data.orderID))) {
            flag = true;
            note += "OrderID Unexpected. ";
        }

        if (data.weight <= 0) {
            flag = true;
            note += "Weight unexpected. ";
        }

        data.date = data.date.split(" ")[0];

        return { ...data, requireReview: flag, note };
    };

    const GetDevicesAndOrderID = (data) => {
        try {
            const relevantData = data.split("LPN Number")[1]?.trim() || "";
            const relevantLines = relevantData.split(" ").filter(line => line.trim());
            const orderID = relevantLines[0]?.split(" ")[0] || "Unknown";
            const itemsArray = relevantData.split(orderID);

            const devices = itemsArray.map(line => {
                const words = line.split(" ").filter(Boolean);
                let name = "", quantity = 0;
                for (let i = 0; i < words.length; i++) {
                    if (words[i + 1] === "EA") {
                        quantity = parseInt(words[i]);
                        break;
                    } else {
                        name += words[i];
                    }
                }
                return name ? { name, quantity } : null;
            }).filter(Boolean);

            return [orderID, devices];
        } catch {
            return ["Unknown", []];
        }
    };

    const GetWaybill = (fileTitle, data) => {
        const waybillCollection = [];

        const tryPush = (val) => val && waybillCollection.push(val);
        tryPush(fileTitle.split(" - ")[2]);
        tryPush(fileTitle.split("-")[2]);

        try {
            const relevantText = GetRevelevantData(data, "Way Bill:", "Ship Date:");
            if (relevantText) tryPush(relevantText);
        } catch {}

        if (!waybillCollection.length) return "NO WAYBILL FOUND";

        const countMap = {};
        for (const wb of waybillCollection) {
            countMap[wb] = (countMap[wb] || 0) + 1;
        }

        let result = Object.entries(countMap).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
        if (result.includes(".pdf")) {
            result = (result.split("."))[0];
        }
        return result;
    };

    const GetDate = (data) => {
        try {
            return GetRevelevantData(data, "Date:", "Packing") || "Unknown";
        } catch {
            return "Unknown";
        }
    };

    const ExtractText = (event) => {
        const files = event.target.files;
        if (!files) return;

        const promises = Array.from(files).map(async (file) => {
            try {
                const text = await pdfToText(file);
                const [name, location] = GetNameAndLocation(text);
                const waybill = GetWaybill(file.name, text);
                const [orderID, devices] = GetDevicesAndOrderID(text);
                const date = GetDate(text);
                const [boxes, weight, skids] = EstimateDevicesAndWeight(devices);
                const techDataArray = await fetchTechData();
                const techMatch = techDataArray?.find(t =>
                    t.Name.toLowerCase().includes(name.toLowerCase()) ||
                    name.toLowerCase().includes(t.Name.toLowerCase())
                );
                const techData = techMatch || { Name: "Unknown", Location: "Unknown" };

                return ReviewData({
                    name,
                    location,
                    waybill,
                    fileName: file.name,
                    orderID,
                    devices,
                    date,
                    boxes,
                    weight,
                    skids
                }, techData);
            } catch (err) {
                console.error("Error parsing PDF", err);
                return null;
            }
        });

        Promise.all(promises).then(parsedData => {
            const validResults = parsedData.filter(Boolean);
            onParsed(validResults);
        });
    };

    return (
        <div>
            <label className="pdf-button">
                Upload 
                <input type="file" accept="application/pdf" multiple onChange={ExtractText} style={{ display: 'none' }} />
            </label>
        </div>
    );
};
