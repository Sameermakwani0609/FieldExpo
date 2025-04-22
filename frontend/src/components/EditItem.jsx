import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tag,
  IndianRupee,
  Package,
  ListTree,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle, // Import the X icon from lucide-react or use any other close icon
} from "lucide-react";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate hook
  const [formData, setFormData] = useState({
    itemName: "",
    mrp: "",
    purchaseRate: "",
    saleRate: "",
    quantity: "",
    quantityUnit: "units",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/items/get-item/${id}`),
          axios.get("http://localhost:5000/api/categories/get-categories"),
        ]);

        const item = itemRes.data.data;

        setFormData({
          itemName: item.itemName,
          mrp: item.MRP,
          purchaseRate: item.purchaseRate,
          saleRate: item.saleRate,
          quantity: item.quantity,
          quantityUnit: item.quantityUnit,
          category: item.category._id,
        });

        setCategories(catRes.data);
      } catch (err) {
        setError("❌ Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await axios.put(
        `http://localhost:5000/api/items/update-item/${id}`,
        formData
      );
      setSuccessMessage("✅ Item updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("❌ Failed to update item. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 font-semibold text-lg">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading item details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center animate-fadeIn relative">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Tag className="w-7 h-7 text-blue-600" />
            Edit Item
          </h1>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              icon={<IndianRupee className="w-4 h-4 text-gray-500" />}
              label="MRP"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
            />
            <InputField
              icon={<Package className="w-4 h-4 text-gray-500" />}
              label="Purchase Rate"
              name="purchaseRate"
              value={formData.purchaseRate}
              onChange={handleChange}
            />
            <InputField
              icon={<IndianRupee className="w-4 h-4 text-gray-500" />}
              label="Sale Rate"
              name="saleRate"
              value={formData.saleRate}
              onChange={handleChange}
            />
            <InputField
              icon={<ListTree className="w-4 h-4 text-gray-500" />}
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Quantity Unit
            </label>
            <select
              name="quantityUnit"
              value={formData.quantityUnit}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              {["units", "kg", "liters", "pieces"].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full mt-4 py-2 rounded-lg shadow-md font-semibold text-white transition-all ${
              loading
                ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-wait"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-[98%]"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
            ) : (
              "Update Item"
            )}
          </button>
        </form>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
      >
        <XCircle />
      </button>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center">
        {icon}
      </span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  </div>
);

export default EditItem;
