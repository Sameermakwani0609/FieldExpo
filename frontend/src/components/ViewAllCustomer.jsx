import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Search, Plus } from "lucide-react";

const ViewCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/get-customers"
      );
      setCustomers(response.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => setSearchQuery(event.target.value);

  const filteredCustomers = customers.filter((customer) =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/delete-customer/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Failed to delete customer", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Customer Management
          </h1>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={() => navigate("/add-customer")}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              <Plus className="mr-2" size={20} />
              Add Customer
            </button>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-6 py-4 border-0 bg-gray-50 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-left pl-8 pr-12"
              />
              <Search
                className="absolute right-6 top-4 text-gray-400"
                size={24}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading customers...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                  <tr>
                    {[
                      "Customer Name",
                      "Address",
                      "Mobile",
                      "Route",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className={`px-8 py-6 text-lg font-semibold ${
                          header === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer._id}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-8 py-5 text-gray-700 font-medium">
                          {customer.customerName}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {customer.customerAddress}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {customer.customerMobile}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {customer.route}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() =>
                                navigate(`/update-customer/${customer._id}`)
                              }
                              className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              aria-label="Edit"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id)}
                              className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-8 py-6 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center p-8">
                          <Search className="mb-4 text-gray-400" size={40} />
                          <p className="text-xl">
                            No customers found matching your search
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
