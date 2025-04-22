import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditSaleBill = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerMobile: "",
    customerAddress: "",
    date: "",
    billType: "Cash",
    discountPercent: 0,
    grandTotal: 0,
    items: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleBill();
  }, []);

  const fetchSaleBill = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sales/get/${id}`);
      const data = res.data;
      setFormData({
        ...data,
        date: data.date?.substring(0, 10),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bill:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] =
      field === "qty" || field === "rate" ? parseFloat(value) || 0 : value;
    updatedItems[index].total =
      (parseFloat(updatedItems[index].qty) || 0) *
      (parseFloat(updatedItems[index].rate) || 0);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    updateGrandTotal(updatedItems);
  };

  const updateGrandTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discount = (total * (formData.discountPercent || 0)) / 100;
    setFormData((prev) => ({ ...prev, grandTotal: total - discount }));
  };

  const addItem = () => {
    const newItem = { name: "", qty: 0, unit: "", rate: 0, total: 0 };
    const updatedItems = [...formData.items, newItem];
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    updateGrandTotal(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/sales/edit/${id}`, formData);
      alert("Sale bill updated successfully!");
      navigate("/view-sales");
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading bill data...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Sale Bill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="customerMobile"
            value={formData.customerMobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <select
            name="billType"
            value={formData.billType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
          <input
            type="number"
            step="0.01"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={(e) => {
              handleChange(e);
              updateGrandTotal(formData.items);
            }}
            placeholder="Discount %"
            className="border p-2 rounded"
            min="0"
          />
          <input
            value={formData.grandTotal.toFixed(2)}
            readOnly
            className="border p-2 rounded"
            placeholder="Grand Total"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Unit</th>
                <th className="p-2 text-left">Rate</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <input
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", e.target.value)
                      }
                      className="border p-1 w-full"
                      min="0"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      className="border p-1 w-full"
                      min="0"
                    />
                  </td>
                  <td className="p-2">₹{item.total.toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addItem}
            className="bg-green-600 text-white px-3 py-1 rounded mt-2"
          >
            + Add Item
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          disabled={formData.items.length === 0}
        >
          Update Bill
        </button>
      </form>
    </div>
  );
};

export default EditSaleBill;
