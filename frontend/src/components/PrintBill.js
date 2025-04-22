import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

const PrintBill = ({ billData }) => {
  const billRef = useRef();
  const [printerSettings, setPrinterSettings] = useState({ paperSize: "A4", printerName: "Default Printer" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/printer").then((res) => {
      setPrinterSettings(res.data || { paperSize: "A4", printerName: "Default Printer" });
    });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
    onAfterPrint: () => {
      axios.post("http://localhost:5000/api/print", {
        billData: billData,
        printerSettings: printerSettings,
      }).then(res => {
        console.log("Print request sent to backend", res.data);
      }).catch(err => {
        console.error("Error sending print request to backend:", err);
      });
    },
  });

  return (
    <div>
      <h3>Using Printer: {printerSettings.printerName}</h3>
      <button onClick={handlePrint}>Print Bill</button>
      <div ref={billRef} style={getPaperStyle(printerSettings.paperSize)}>
        <h2>Invoice</h2>
        <p><strong>Customer:</strong> {billData.customerName}</p>
        <p><strong>Date:</strong> {billData.date}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.rate}</td>
                <td>{item.qty * item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total: ₹{billData.total}</h3>
      </div>
    </div>
  );
};

const getPaperStyle = (size) => ({
  A4: { width: "210mm", padding: "10mm" },
  A5: { width: "148mm", padding: "8mm" },
  Thermal: { width: "80mm", padding: "5mm" },
}[size]);

export default PrintBill;
