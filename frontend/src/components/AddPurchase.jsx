import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Loader } from "lucide-react";
const initialFormData = {
  partyName: "",
  invoiceNumber: "",
  date: "",
  paymentMode: "Cash",
  itemName: "",
  mrp: "",
  quantity: "",
  purchaseRate: "",
  saleRate: "",
  unit: "pcs",
};

const AddPurchase = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["quantity", "mrp", "purchaseRate", "saleRate"].includes(name)) {
      if (parseFloat(value) < 0) {
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };
  const handlePartyNameChange = async (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      partyName: value,
    });
    if (value.length >= 3) {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/suppliers?name=${value}`
      );
      const data = await response.json();
      setSuggestions(data);
      setIsLoading(false);
    }
  };
  const selectSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      partyName: suggestion.firmName,
    });
    setSuggestions([]);
  };
  const addItem = useCallback(() => {
    let { itemName, mrp, quantity, purchaseRate, saleRate, unit } = formData;
    mrp = parseFloat(mrp) || 0;
    quantity = parseFloat(quantity) || 0;
    purchaseRate = parseFloat(purchaseRate) || 0;
    saleRate = parseFloat(saleRate) || 0;

    const isDuplicate = items.some((item) => item.itemName === itemName);
    if (isDuplicate) {
      alert("This item has already been added.");
      return;
    }

    if (
      !itemName ||
      quantity <= 0 ||
      purchaseRate <= 0 ||
      saleRate < purchaseRate ||
      !unit
    ) {
      alert(
        "Please enter valid item details. Sale Rate should be greater than or equal to Purchase Rate, and unit must be selected."
      );
      return;
    }
    setItems([
      ...items,
      {
        itemName,
        mrp,
        quantity,
        unit,
        purchaseRate,
        saleRate,
        total: quantity * purchaseRate,
      },
    ]);

    setFormData({
      ...formData,
      itemName: "",
      mrp: "",
      quantity: "",
      purchaseRate: "",
      saleRate: "",
      unit: "pcs",
    });
  }, [formData, items]);

  const removeItem = useCallback(
    (index) => {
      setItems(items.filter((_, i) => i !== index));
    },
    [items]
  );

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  const resetForm = () => {
    setFormData(initialFormData);
    setItems([]);
  };
  const printPurchaseBill = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Bill</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              font-size: 12pt;
              color: #000;
            }
            h2 {
              text-align: center;
              margin-bottom: 10px;
              font-size: 20pt;
            }
            .info {
              margin-bottom: 15px;
            }
            .info p {
              font-size: 12pt;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #333;
              padding: 8px;
              font-size: 11pt;
            }
            th {
              background-color: #f4f4f4;
              text-align: left;
            }
            .total {
              margin-top: 15px;
              font-weight: bold;
              font-size: 13pt;
              text-align: right;
            }
  
            /* A4 Print Style */
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
            }
  
            /* A5 Print Style */
            @media print and (min-width: 420px) and (max-width: 600px) {
              @page {
                size: A5;
                margin: 10mm;
              }
              body {
                font-size: 11pt;
              }
            }
  
            /* Thermal Printer (approx. 80mm) */
            @media print and (max-width: 80mm) {
              body {
                padding: 5px;
                font-size: 9pt;
              }
              h2 {
                font-size: 12pt;
              }
              .info p {
                font-size: 8pt;
              }
              th, td {
                font-size: 8pt;
                padding: 4px;
              }
              .total {
                font-size: 9pt;
              }
            }
          </style>
        </head>
        <body>
          <h2>Purchase Bill</h2>
          <div class="info">
            <p><strong>Party Name:</strong> ${formData.partyName}</p>
            <p><strong>Invoice Number:</strong> ${formData.invoiceNumber}</p>
            <p><strong>Date:</strong> ${formData.date}</p>
            <p><strong>Payment Mode:</strong> ${formData.paymentMode}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.itemName}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>₹${item.purchaseRate.toFixed(2)}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">Grand Total: ₹${grandTotal.toFixed(2)}</div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  const savePurchase = async () => {
    if (!formData.invoiceNumber || formData.invoiceNumber.trim() === "") {
      alert("Invoice number is required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save purchase.");
      }
      const shouldPrint = window.confirm(
        "Purchase Saved Successfully!\n\nDo you want to print the bill?"
      );
      if (shouldPrint) {
        printPurchaseBill(); 
      } else {
        alert("Purchase Saved Successfully!");
      }

      resetForm(); 
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        New Purchase Entry
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
            placeholder="Party Name"
            className="p-2 border rounded w-full"
          />
          <input
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="Invoice Number"
            className="p-2 border rounded w-full"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option>Cash</option>
            <option>Credit</option>
          </select>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <input
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Item Name"
            className="p-2 border rounded w-full"
          />
          <input
            name="mrp"
            type="number"
            value={formData.mrp}
            onChange={handleChange}
            placeholder="MRP"
            className="p-2 border rounded w-full"
          />
          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="p-2 border rounded w-full"
          />
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="liters">Liters</option>
            <option value="box">Box</option>
            <option value="pack">Pack</option>
          </select>
          <input
            name="purchaseRate"
            type="number"
            value={formData.purchaseRate}
            onChange={handleChange}
            placeholder="Purchase Rate"
            className="p-2 border rounded w-full"
          />
          <input
            name="saleRate"
            type="number"
            value={formData.saleRate}
            onChange={handleChange}
            placeholder="Sale Rate"
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          onClick={addItem}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold"
        >
          Add Item
        </button>
      </div>
      {/* Item Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">No.</th>
              <th className="p-2">Item Name</th>
              <th className="p-2">MRP</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Purchase Rate</th>
              <th className="p-2">Sale Rate</th>
              <th className="p-2">Total</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No items added yet.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.itemName}</td>
                  <td className="p-2">{item.mrp}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">{item.purchaseRate}</td>
                  <td className="p-2">{item.saleRate}</td>
                  <td className="p-2">{item.total.toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={savePurchase}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg font-bold block w-full"
      >
        {loading ? (
          <Loader className="animate-spin inline-block" />
        ) : (
          "Save & Print"
        )}
      </button>
    </div>
  );
};
export default AddPurchase;
