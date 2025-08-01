import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  X,
  Save,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const AddBeat = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!address.trim()) {
      setError("Please enter a valid address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-beat",
        { beatName: address },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message);
      setAddress("");
    } catch (err) {
      console.error("Save Error:", err);
      setError(err.response?.data?.error || "Failed to Save Address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-md p-6 sm:p-8 shadow-2xl rounded-xl bg-white border border-gray-200/80 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Add New Beat
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-xs mx-auto leading-5">
              Create and manage location beats with unique identifiers
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-1">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <MapPin className="text-gray-600" size={18} strokeWidth={2} />
            <span className="tracking-tight">Beat Name</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter Beat Name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 placeholder-gray-400 transition-all duration-300 text-gray-700 font-medium"
          />
        </div>

        <div className="mb-5 space-y-3">
          {error && (
            <div className="animate-slide-down flex items-center gap-3 p-4 bg-red-50/80 border border-red-100 text-red-700 rounded-lg backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          {message && (
            <div className="animate-slide-down flex items-center gap-3 p-4 bg-green-50/80 border border-green-100 text-green-700 rounded-lg backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300 ${
              isLoading
                ? "bg-gradient-to-r from-green-400 to-emerald-400 cursor-wait"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-[98%]"
            }`}
          >
            {isLoading ? (
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
                <Save className="w-5 h-5 mr-2" strokeWidth={2} />
                Save Beat
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full py-3 text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center transition-all duration-300 hover:bg-gray-50 rounded-xl active:scale-[98%]"
          >
            <X className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddBeat;
