import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, PlusCircle, Search } from "lucide-react";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirmation = (id) => {
    setSupplierIdToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSupplierIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!supplierIdToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/suppliers/${supplierIdToDelete}`
      );
      setSuppliers(
        suppliers.filter((supplier) => supplier._id !== supplierIdToDelete)
      );
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier. Please try again.");
    } finally {
      handleCancelDelete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this supplier? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Supplier Management
          </h1>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={() => navigate("/add-supplier")}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              <PlusCircle className="mr-2" size={20} />
              Add Supplier
            </button>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
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
              Loading suppliers...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                  <tr>
                    {[
                      "Firm Name",
                      "Supplier Name",
                      "Address",
                      "Phone",
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
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier, index) => (
                      <tr
                        key={supplier._id}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-8 py-5 text-gray-700 font-medium">
                          {supplier.firmName}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {supplier.supplierName}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {supplier.address}
                        </td>
                        <td className="px-8 py-5 text-gray-600">
                          {supplier.phone}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() =>
                                navigate(`/edit-supplier/${supplier._id}`)
                              }
                              className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                              aria-label="Edit"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteConfirmation(supplier._id)
                              }
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
                            No suppliers found matching your search
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

export default SupplierList;
