import React, { useState, useEffect } from "react";
import axios from "axios";

const PrinterSettings = () => {
  const [paperSize, setPaperSize] = useState("A4");
  const [printerName, setPrinterName] = useState("Default Printer");

  useEffect(() => {
    axios.get("http://localhost:5000/api/printer")
      .then((res) => {
        setPaperSize(res.data?.paperSize || "A4");
        setPrinterName(res.data?.printerName || "Default Printer");
      })
      .catch((err) => console.error("Error fetching printer settings:", err));
  }, []);

  const handleApplySettings = () => {
    axios.post("http://localhost:5000/api/printer", { paperSize, printerName })
      .then(() => {
        console.log("Printer settings saved successfully!");
      })
      .catch((err) => console.error("Error updating printer settings:", err));
  };

  return (
    <div>
      <h2>Printer Settings</h2>
      <label>Paper Size:</label>
      <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
        <option value="A4">A4</option>
        <option value="A5">A5</option>
        <option value="Thermal">Thermal (80mm)</option>
      </select>

      <label>Printer Name:</label>
      <input type="text" value={printerName} onChange={(e) => setPrinterName(e.target.value)} />

      <button onClick={handleApplySettings}>Save</button>
    </div>
  );
};

export default PrinterSettings;
