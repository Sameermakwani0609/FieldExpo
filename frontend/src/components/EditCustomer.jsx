import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, MapPin, Phone, Map, Save } from "lucide-react";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerMobile: "",
    route: "",
  });
  const [beats, setBeats] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/get-customer/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch customer details");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        alert("Failed to load customer data.");
      }
    };

    const fetchBeats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get-beats");
        if (!response.ok) throw new Error("Failed to fetch beats");
        const data = await response.json();
        setBeats(data);
      } catch (error) {
        console.error("Error fetching beats:", error);
      }
    };

    fetchCustomerDetails();
    fetchBeats();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-customer/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update customer data");

      setSuccessMessage("Customer updated successfully!");

      setTimeout(() => {
        navigate("/ViewCustomer");
      }, 3000);
    } catch (error) {
      console.error("Error updating customer data:", error);
      alert("Failed to update customer data. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Customer</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="text-gray-500" size={18} /> Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="text-gray-500" size={18} /> Customer Address
            </label>
            <textarea
              name="customerAddress"
              rows="3"
              value={formData.customerAddress}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="text-gray-500" size={18} /> Mobile Number
            </label>
            <input
              type="tel"
              name="customerMobile"
              value={formData.customerMobile}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Map className="text-gray-500" size={18} /> Select Route
            </label>
            <select
              name="route"
              value={formData.route}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
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
              className="w-full py-3 px-4 text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center text-lg shadow-md"
            >
              <Save className="mr-2" size={20} /> Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
