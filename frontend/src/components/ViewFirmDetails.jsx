import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewFirmDetails = () => {
  const [firm, setFirm] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFirmDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/firm");
      setFirm(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching firm details:", err);
      setError("Failed to load firm details. Please try again.");
    }
  };

  const deleteFirm = async () => {
    if (!window.confirm("Are you sure you want to delete this firm?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/firm/${firm._id}`);
      alert("Firm deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error("Error deleting firm:", err);
      alert("Failed to delete firm. Please try again.");
    }
  };

  useEffect(() => {
    fetchFirmDetails();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg text-red-600">
        <p>{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
          onClick={fetchFirmDetails}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-700">
        Loading firm details...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Firm Details</h2>

        {firm.shopLogo && (
          <img
            src={firm.shopLogo}
            alt="Shop Logo"
            className="mx-auto mb-6 w-36 h-36 object-cover rounded-full border-4 border-gray-300 shadow-md"
          />
        )}

        <div className="space-y-4 text-lg text-gray-700">
          <p>
            <strong className="text-gray-900">Shop Name:</strong>{" "}
            {firm.shopName}
          </p>
          <p>
            <strong className="text-gray-900">Address:</strong>{" "}
            {firm.shopAddress}
          </p>
          <p>
            <strong className="text-gray-900">Mobile:</strong> {firm.shopMobile}
          </p>
          <p>
            <strong className="text-gray-900">Bill Title:</strong>{" "}
            {firm.billTitle}
          </p>
          <p>
            <strong className="text-gray-900">Tagline:</strong> {firm.tagline}
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all shadow-md"
            onClick={() => navigate(`/edit-firm/${firm._id}`)}
          >
            Edit Firm Details
          </button>
          <button
            className="px-6 py-3 bg-red-600 text-white font-semibold text-lg rounded-lg hover:bg-red-700 transition-all shadow-md"
            onClick={deleteFirm}
          >
            Delete Firm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewFirmDetails;
