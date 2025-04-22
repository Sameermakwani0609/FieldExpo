import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building,
  User,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Save,
} from "lucide-react";

const EditSupplierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    firmName: "",
    supplierName: "",
    address: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/suppliers/${id}`
        );
        setSupplier(response.data);
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setError("Failed to fetch supplier details.");
      }
    };
    fetchSupplier();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^[0-9]*$/.test(value)) return;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !supplier.firmName ||
      !supplier.supplierName ||
      !supplier.address ||
      !supplier.phone
    ) {
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${id}`, supplier);
      setSuccessMessage("Supplier updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/suppliers");
      }, 2000);
    } catch (error) {
      setError("Failed to update supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Edit Supplier
          </h1>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firm Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="firmName"
                  value={supplier.firmName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter firm name"
                />
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="supplierName"
                  value={supplier.supplierName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter supplier name"
                />
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={supplier.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact number"
              />
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <textarea
                name="address"
                value={supplier.address}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter full address"
              />
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300 ${
                loading
                  ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-wait"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-[98%]"
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Update Supplier
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setSupplier({
                  firmName: "",
                  supplierName: "",
                  address: "",
                  phone: "",
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierForm;
