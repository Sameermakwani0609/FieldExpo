import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Search, Plus } from "lucide-react";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/categories/get-categories"
      );
      setCategories(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/categories/delete-category/${id}`
      );
      setDeleteConfirm(null);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Category Management
          </h1>
          <button
            onClick={() => navigate("/add-category")}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
          >
            <Plus className="mr-2" size={20} />
            Add New Category
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-6 py-4 border-0 bg-gray-50 rounded-xl text-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <Search
              className="absolute right-6 top-4 text-gray-400"
              size={24}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading categories...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                <tr>
                  <th className="px-8 py-6 text-left text-lg font-semibold">
                    Category Name
                  </th>
                  <th className="px-8 py-6 text-right text-lg font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <tr
                      key={category._id}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-8 py-5 text-gray-700 font-medium">
                        {category.name}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => handleEdit(category._id)}
                            className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label="Edit"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(category._id)}
                            className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label="Delete"
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
                      colSpan="2"
                      className="px-8 py-6 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center p-8">
                        <Search className="mb-4 text-gray-400" size={40} />
                        <p className="text-xl">
                          No categories found matching your search
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategories;
