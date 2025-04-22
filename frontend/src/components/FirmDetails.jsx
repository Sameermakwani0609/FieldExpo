import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Building,
  MapPin,
  Phone,
  Receipt,
  Tag,
  Image,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const FirmDetails = () => {
  const [firm, setFirm] = useState({
    firmName: "",
    shopAddress: "",
    mobileNumber: "",
    billTitle: "",
    tagline: "",
    logo: null,
  });

  const [existingFirm, setExistingFirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/firm")
      .then((response) => {
        if (response.data) {
          setExistingFirm(response.data);
          setFirm({ ...response.data, logo: null });
        }
      })
      .catch((error) => console.error("Error fetching firm details:", error));
  }, []);

  const handleChange = (e) => {
    setFirm({ ...firm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFirm({ ...firm, logo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("firmName", firm.firmName);
    formData.append("shopAddress", firm.shopAddress);
    formData.append("mobileNumber", firm.mobileNumber);
    formData.append("billTitle", firm.billTitle);
    formData.append("tagline", firm.tagline);
    if (firm.logo) formData.append("logo", firm.logo);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/firm",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccessMessage("Firm details saved successfully!");
      setExistingFirm(response.data.firm);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save firm details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Firm Details
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

        {existingFirm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-gray-600" />
              Current Firm Details
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold">
                  {existingFirm.firmName}
                </h4>
              </div>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {existingFirm.shopAddress}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {existingFirm.mobileNumber}
              </p>
              <p className="flex items-center gap-2">
                <Receipt className="w-4 h-4" /> {existingFirm.billTitle}
              </p>
              <p className="flex items-center gap-2">
                <Tag className="w-4 h-4" /> {existingFirm.tagline}
              </p>
              {existingFirm.logo && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" /> Current Logo:
                  </p>
                  <img
                    src={
                      existingFirm.logo.startsWith("http")
                        ? existingFirm.logo
                        : `http://localhost:5000${existingFirm.logo}`
                    }
                    alt="Firm Logo"
                    className="w-32 aspect-square object-contain border rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
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
                  value={firm.firmName}
                  onChange={handleChange}
                  placeholder="Enter firm name"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  required
                />
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="mobileNumber"
                  value={firm.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  required
                />
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Address
            </label>
            <div className="relative">
              <input
                type="text"
                name="shopAddress"
                value={firm.shopAddress}
                onChange={handleChange}
                placeholder="Enter shop address"
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                required
              />
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="billTitle"
                  value={firm.billTitle}
                  onChange={handleChange}
                  placeholder="Enter bill title"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  required
                />
                <Receipt className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tagline"
                  value={firm.tagline}
                  onChange={handleChange}
                  placeholder="Enter tagline"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                />
                <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="relative">
              <label className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-gray-50">
                <span className="text-gray-400">
                  {firm.logo ? firm.logo.name : "Choose a logo..."}
                </span>
                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <Image className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Details"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default FirmDetails;
