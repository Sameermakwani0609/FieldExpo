import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tag,
  IndianRupee,
  Package,
  ListTree,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

const AddItem = () => {
  const navigate = useNavigate();
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
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [categoryFetchError, setCategoryFetchError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoryFetchError(false);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/categories/get-categories"
      );

      if (Array.isArray(response.data)) {
        const formattedCategories = response.data.map((cat) => ({
          id: cat._id,
          name: cat.name || "Unnamed Category",
        }));
        setCategories(formattedCategories);
      } else {
        console.error("Unexpected response format:", response.data);
        setCategoryFetchError(true);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.response || error);
      setCategoryFetchError(true);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.itemName.trim()) errors.itemName = "Item name is required.";
    if (!formData.mrp || formData.mrp <= 0)
      errors.mrp = "MRP must be a positive number.";
    if (!formData.purchaseRate || formData.purchaseRate <= 0)
      errors.purchaseRate = "Purchase Rate must be a positive number.";
    if (!formData.saleRate || formData.saleRate <= 0)
      errors.saleRate = "Sale Rate must be a positive number.";
    if (parseFloat(formData.saleRate) < parseFloat(formData.purchaseRate))
      errors.saleRate = "Sale Rate cannot be less than Purchase Rate.";
    if (!formData.quantity || formData.quantity <= 0)
      errors.quantity = "Quantity must be a positive number.";
    if (!formData.category) errors.category = "Please select a category.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFormErrors({});

    if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/items/add",
        formData
      );

      setSuccessMessage("Item added successfully!");
      setFormData({
        itemName: "",
        mrp: "",
        purchaseRate: "",
        saleRate: "",
        quantity: "",
        quantityUnit: "units",
        category: "",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to add item. Please try again."
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600" />
            Add New Item
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XCircle className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-center text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 items-center text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name"
                className={`block w-full pl-10 pr-4 py-2.5 border ${
                  formErrors.itemName
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } rounded-lg shadow-sm placeholder-gray-400`}
              />
              <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            {formErrors.itemName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.itemName}
              </p>
            )}
          </div>

          <div className="space-y-6 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              Pricing Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  name: "mrp",
                  label: "MRP",
                  icon: <IndianRupee className="w-5 h-5 text-gray-400" />,
                },
                {
                  name: "purchaseRate",
                  label: "Purchase Rate",
                  icon: <IndianRupee className="w-5 h-5 text-gray-400" />,
                },
                {
                  name: "saleRate",
                  label: "Sale Rate",
                  icon: <IndianRupee className="w-5 h-5 text-gray-400" />,
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={`block w-full pl-10 pr-4 py-2.5 border ${
                        formErrors[field.name]
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } rounded-lg shadow-sm placeholder-gray-400`}
                    />
                    <div className="absolute left-3 top-3">{field.icon}</div>
                  </div>
                  {formErrors[field.name] && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Stock Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className={`block w-full pl-10 pr-4 py-2.5 border ${
                      formErrors.quantity
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } rounded-lg shadow-sm placeholder-gray-400`}
                  />
                  <ListTree className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {formErrors.quantity && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Unit
                </label>
                <div className="relative">
                  <select
                    name="quantityUnit"
                    value={formData.quantityUnit}
                    onChange={handleChange}
                    className="block w-full pl-4 pr-4 py-2.5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm placeholder-gray-400"
                  >
                    <option value="units">Units</option>
                    <option value="kg">Kg</option>
                    <option value="liters">Liters</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ListTree className="w-5 h-5 text-blue-600" />
              Select Category
            </h3>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full pl-4 pr-4 py-2.5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm placeholder-gray-400"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.category}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loadingSubmit}
              className={`w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-lg transition-all ${
                loadingSubmit
                  ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-wait"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-[98%]"
              }`}
            >
              {loadingSubmit ? (
                <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
              ) : (
                "Save Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
