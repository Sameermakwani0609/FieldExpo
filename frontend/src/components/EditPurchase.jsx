import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Pencil, Trash2, Save } from "lucide-react";

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    partyName: "",
    invoiceNumber: "",
    date: "",
    paymentMode: "Cash",
    items: [],
  });

  const [newItem, setNewItem] = useState({
    itemName: "",
    mrp: "",
    quantity: "",
    unit: "pcs",
    purchaseRate: "",
    saleRate: "",
    total: 0,
  });

  useEffect(() => {
    const fetchPurchaseBill = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/purchase/${id}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch purchase bill details.");
        const data = await response.json();

        setFormData({
          partyName: data.purchaseBill.partyName,
          invoiceNumber: data.purchaseBill.invoiceNumber,
          date: data.purchaseBill.date.split("T")[0],
          paymentMode: data.purchaseBill.paymentMode,
          items: data.items.map((item) => ({
            ...item,
            total: item.quantity * item.purchaseRate,
          })),
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseBill();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...newItem,
      [name]: value,
    };
    if (name === "quantity" || name === "purchaseRate") {
      updated.total =
        parseFloat(updated.quantity || 0) *
        parseFloat(updated.purchaseRate || 0);
    }
    setNewItem(updated);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    if (name === "quantity" || name === "purchaseRate") {
      updatedItems[index].total =
        parseFloat(updatedItems[index].quantity || 0) *
        parseFloat(updatedItems[index].purchaseRate || 0);
    }
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    if (!newItem.itemName || !newItem.quantity || !newItem.purchaseRate) {
      alert("Please fill required fields");
      return;
    }
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
    setNewItem({
      itemName: "",
      mrp: "",
      quantity: "",
      unit: "pcs",
      purchaseRate: "",
      saleRate: "",
      total: 0,
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const savePurchase = async () => {
    if (!formData.invoiceNumber || formData.invoiceNumber.trim() === "") {
      alert("Invoice number is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/purchase/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update purchase bill.");

      alert("Purchase bill updated successfully!");
      navigate("/purchase-bills");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () =>
    formData.items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }
  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Edit Purchase Bill
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
      <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Add New Item</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {["itemName", "mrp", "quantity", "purchaseRate", "saleRate"].map(
            (field) => (
              <input
                key={field}
                name={field}
                value={newItem[field]}
                type={
                  field === "quantity" || field === "purchaseRate"
                    ? "number"
                    : "text"
                }
                onChange={handleNewItemChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="p-2 border rounded"
              />
            )
          )}
          <select
            name="unit"
            value={newItem.unit}
            onChange={handleNewItemChange}
            className="p-2 border rounded"
          >
            <option value="pcs">pcs</option>
            <option value="kg">kg</option>
            <option value="liters">liters</option>
            <option value="box">box</option>
          </select>
          <button
            onClick={addItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Item List</h2>
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Item</th>
                <th className="border px-3 py-2">MRP</th>
                <th className="border px-3 py-2">Qty</th>
                <th className="border px-3 py-2">Unit</th>
                <th className="border px-3 py-2">Purchase Rate</th>
                <th className="border px-3 py-2">Sale Rate</th>
                <th className="border px-3 py-2">Total</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index}>
                  {editingIndex === index ? (
                    <>
                      {[
                        "itemName",
                        "mrp",
                        "quantity",
                        "unit",
                        "purchaseRate",
                        "saleRate",
                      ].map((field) => (
                        <td key={field} className="border p-1">
                          <input
                            name={field}
                            value={item[field]}
                            onChange={(e) => handleItemChange(index, e)}
                            className="p-1 border rounded w-full text-sm"
                          />
                        </td>
                      ))}
                      <td className="border px-2 text-center">
                        {item.total.toFixed(2)}
                      </td>
                      <td className="border px-2 text-center">
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          <Save size={14} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-2">{item.itemName}</td>
                      <td className="border px-2">{item.mrp}</td>
                      <td className="border px-2">{item.quantity}</td>
                      <td className="border px-2">{item.unit}</td>
                      <td className="border px-2">{item.purchaseRate}</td>
                      <td className="border px-2">{item.saleRate}</td>
                      <td className="border px-2">{item.total.toFixed(2)}</td>
                      <td className="border px-2 flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4 pr-6">
          <div className="text-right space-y-2">
            <div className="text-xl font-bold text-blue-600">
              Grant Total: ₹{calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={savePurchase}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg"
          >
            Save Purchase Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPurchase;
