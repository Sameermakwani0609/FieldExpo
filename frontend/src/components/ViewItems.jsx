import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Search, Plus } from "lucide-react";

const ViewItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/items/view-items"
      );
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/items/delete-item/${id}`);
      setMessage("Item deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-900">Item Management</h1>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={() => navigate("/add-item")}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 whitespace-nowrap"
            >
              <Plus className="mr-2" size={20} />
              Add New Item
            </button>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border-0 bg-gray-50 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <Search
                className="absolute right-6 top-4 text-gray-400"
                size={24}
              />
            </div>
          </div>
        </div>
        {(error || message) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-xl shadow-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="p-4 bg-green-100 text-green-700 rounded-xl shadow-sm">
                {message}
              </div>
            )}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading inventory...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                  <tr>
                    {[
                      "Item Name",
                      "MRP",
                      "Purchase Rate",
                      "Sale Rate",
                      "Quantity",
                      "Unit",
                      "Category",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-8 py-6 text-left text-lg font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-8 py-5 text-gray-700 font-medium">
                          {item.itemName}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          ₹{item.MRP?.toLocaleString()}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          ₹{item.purchaseRate?.toLocaleString()}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          ₹{item.saleRate?.toLocaleString()}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-8 py-5 text-gray-600 uppercase text-sm font-medium">
                          {item.quantityUnit}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {item.category?.name || "–"}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => navigate(`/edit-item/${item._id}`)}
                              className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              aria-label="Edit"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
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
                        colSpan="8"
                        className="px-8 py-6 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center p-8">
                          <Search className="mb-4 text-gray-400" size={40} />
                          <p className="text-xl">
                            No items found matching your search
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

export default ViewItems;
