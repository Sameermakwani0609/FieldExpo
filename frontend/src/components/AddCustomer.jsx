import React, { useState, useEffect } from "react";
import { User, MapPin, Phone, Map, Save } from "lucide-react";

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerMobile: "",
    route: "",
  });
  const [beats, setBeats] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get-beats");
        if (!response.ok) {
          throw new Error("Failed to fetch beats");
        }
        const data = await response.json();
        setBeats(data);
      } catch (error) {
        console.error("Error fetching beats:", error);
        alert("Failed to fetch beats. Please try again later.");
      }
    };
    fetchBeats();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.customerName ||
      !formData.customerAddress ||
      !formData.customerMobile ||
      !formData.route
    ) {
      alert("Please fill all fields!");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to save customer data");
      }
      setSuccessMessage("✅ Customer added successfully!");
      setTimeout(() => {
        setFormData({
          customerName: "",
          customerAddress: "",
          customerMobile: "",
          route: "",
        });
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving customer data:", error);
      alert("Failed to save customer data. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <main className="w-full max-w-2xl px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in the customer details below
          </p>
        </div>
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
            {successMessage}
          </div>
        )}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="text-gray-500" size={16} /> Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="text-gray-500" size={16} /> Customer Address
              </label>
              <textarea
                name="customerAddress"
                rows="3"
                placeholder="Enter customer address"
                value={formData.customerAddress}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="text-gray-500" size={16} /> Mobile Number
              </label>
              <input
                type="tel"
                name="customerMobile"
                placeholder="Enter mobile number"
                value={formData.customerMobile}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Map className="text-gray-500" size={16} /> Select Route
              </label>
              <select
                name="route"
                value={formData.route}
                onChange={handleChange}
                required
                className="mt-1 w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a route</option>
                {beats.map((beat) => (
                  <option key={beat._id} value={beat.beatName}>
                    {beat.beatName}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 text-white bg-green-600 hover:bg-green-700 rounded-md transition duration-200 shadow-md"
              >
                <Save className="mr-2" size={18} />
                Save Customer
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCustomer;
