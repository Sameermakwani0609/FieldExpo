import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditFirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firm, setFirm] = useState({
    shopName: "",
    shopAddress: "",
    shopMobile: "",
    billTitle: "",
    tagline: "",
    shopLogo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFirmDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/firm/${id}`
        );
        setFirm(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching firm details:", err);
        setError("Failed to load firm details.");
        setLoading(false);
      }
    };

    fetchFirmDetails();
  }, [id]);
  const handleChange = (e) => {
    setFirm({ ...firm, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("shopName", firm.shopName);
    formData.append("shopAddress", firm.shopAddress);
    formData.append("shopMobile", firm.shopMobile);
    formData.append("billTitle", firm.billTitle);
    formData.append("tagline", firm.tagline);
    if (selectedFile) {
      formData.append("shopLogo", selectedFile);
    }

    try {
      await axios.put(`http://localhost:5000/api/firm/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Firm details updated successfully!");
      navigate("/view-firms");
    } catch (err) {
      console.error("Error updating firm details:", err);
      setError("Failed to update firm details.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Firm Details
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-gray-700">Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={firm.shopName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="shopAddress"
              value={firm.shopAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Mobile</label>
            <input
              type="text"
              name="shopMobile"
              value={firm.shopMobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Bill Title</label>
            <input
              type="text"
              name="billTitle"
              value={firm.billTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={firm.tagline}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {firm.shopLogo && !selectedFile && (
            <div className="flex justify-center">
              <img
                src={firm.shopLogo}
                alt="Shop Logo"
                className="w-36 h-36 object-cover rounded-full border-4 border-gray-300 shadow-md"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700">Upload New Logo</label>
            <input
              type="file"
              name="shopLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-all"
          >
            Update Firm Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFirm;
