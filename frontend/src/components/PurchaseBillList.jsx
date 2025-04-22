import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Loader } from "lucide-react";

const PurchaseBillList = () => {
  const navigate = useNavigate();
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPurchaseBills = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/purchase/all");
      if (!response.ok) {
        throw new Error("Failed to fetch purchase bills.");
      }
      const data = await response.json();
      setPurchaseBills(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const deletePurchaseBill = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase bill?")) {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/purchase/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete purchase bill.");
        }
        fetchPurchaseBills();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const editPurchaseBill = (id) => {
    navigate(`/edit-purchase/${id}`);
  };
  const viewPurchaseBill = (id) => {
    navigate(`/view-purchase/${id}`);
  };
  useEffect(() => {
    fetchPurchaseBills();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Purchase Bills
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin" size={40} />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Invoice Number</th>
                <th className="p-2">Party Name</th>
                <th className="p-2">Date</th>
                <th className="p-2">Payment Mode</th>
                <th className="p-2">Total Amount</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseBills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No purchase bills found.
                  </td>
                </tr>
              ) : (
                purchaseBills.map((bill) => (
                  <tr key={bill._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{bill.invoiceNumber}</td>
                    <td className="p-2">{bill.partyName}</td>
                    <td className="p-2">
                      {new Date(bill.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{bill.paymentMode}</td>
                    <td className="p-2">
                      {(bill.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => viewPurchaseBill(bill._id)}
                        className="text-green-600 hover:text-green-800"
                        aria-label="View"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => editPurchaseBill(bill._id)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => deletePurchaseBill(bill._id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseBillList;
