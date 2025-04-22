import React, { useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const AddSale = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    customerAddress: "",
    customerMobile: "",
    date: "",
    billType: "",
    discountPercent: 0,
  });

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: "",
    mrp: "",
    quantity: 1,
    unit: "",
    saleRate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (!newItem.itemName || !newItem.quantity || !newItem.saleRate) return;
    const total = newItem.quantity * newItem.saleRate;
    setItems([
      ...items,
      {
        name: newItem.itemName,
        rate: newItem.saleRate,
        qty: newItem.quantity,
        unit: newItem.unit,
        total: total,
      },
    ]);
    setNewItem({ itemName: "", mrp: "", quantity: 1, unit: "", saleRate: "" });
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const editItem = (index) => {
    const item = items[index];
    setNewItem({
      itemName: item.name,
      saleRate: item.rate,
      quantity: item.qty,
      unit: item.unit,
      mrp: "",
    });
    removeItem(index);
  };

  const itemTotal = items.reduce((acc, cur) => acc + cur.total, 0);
  const discountAmount = (itemTotal * formData.discountPercent) / 100;
  const grandTotal = itemTotal - discountAmount;

  const saveSale = async () => {
    setLoading(true);
    try {
      const saleShort = {
        ...formData,
        grandTotal,
      };

      await axios.post("http://localhost:5000/api/sales", {
        saleShort,
        saleLong: items,
      });

      alert("Sale saved!");
      setFormData({
        invoiceNumber: "",
        customerName: "",
        customerAddress: "",
        customerMobile: "",
        date: "",
        billType: "",
        discountPercent: 0,
      });
      setItems([]);
    } catch (err) {
      alert(
        "Error saving sale: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Sale</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="invoiceNumber"
          placeholder="Invoice Number"
          value={formData.invoiceNumber}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={formData.customerName}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="customerAddress"
          placeholder="Customer Address"
          value={formData.customerAddress}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="customerMobile"
          placeholder="Customer Mobile"
          value={formData.customerMobile}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select
          name="billType"
          value={formData.billType}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Bill Type</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>
      </div>

      {/* Item Inputs */}
      <div className="flex gap-4 mb-4">
        <input
          name="itemName"
          placeholder="Item Name"
          value={newItem.itemName}
          onChange={handleItemChange}
          className="p-2 border rounded"
        />
        <input
          name="mrp"
          type="number"
          placeholder="MRP"
          value={newItem.mrp}
          onChange={handleItemChange}
          className="p-2 border rounded w-24"
        />
        <input
          name="quantity"
          type="number"
          placeholder="Qty"
          value={newItem.quantity}
          onChange={handleItemChange}
          className="p-2 border rounded w-20"
        />
        <input
          name="unit"
          placeholder="Unit"
          value={newItem.unit}
          onChange={handleItemChange}
          className="p-2 border rounded w-24"
        />
        <input
          name="saleRate"
          type="number"
          placeholder="Sale Rate"
          value={newItem.saleRate}
          onChange={handleItemChange}
          className="p-2 border rounded w-24"
        />
        <button
          onClick={addItem}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* Item Table */}
      <div className="overflow-auto mb-6">
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Item Name</th>
              <th className="p-2">MRP</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Total</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-400">
                  No items added.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.mrp}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">{item.rate}</td>
                  <td className="p-2">{item.total.toFixed(2)}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => editItem(index)}>
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </button>
                    <button onClick={() => removeItem(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-md font-medium">Discount (%)</label>
          <input
            name="discountPercent"
            type="number"
            value={formData.discountPercent}
            onChange={handleChange}
            className="p-2 border rounded w-1/4"
          />
        </div>
        <div className="text-right text-lg font-semibold">
          Discount Amount: ₹{discountAmount.toFixed(2)}
        </div>
        <div className="text-right text-xl font-bold">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={saveSale}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
        >
          {loading ? "Saving..." : "Save Sale"}
        </button>
      </div>
    </div>
  );
};

export default AddSale;
