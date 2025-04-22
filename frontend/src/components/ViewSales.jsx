import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewSales = () => {
  const [sales, setSales] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales/get-all");
      setSales(res.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/sales/delete/${id}`);
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleEdit = (date) => {
    navigate("/edit-sale", { state: { billDate: date } });
  };

  const handleView = (bill) => {
    setSelectedBill(bill);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Sale Bills</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Customer Name</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Bill Type</th>
              <th className="text-left px-4 py-2">Grand Total</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{sale.customerName}</td>
                <td className="px-4 py-2">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{sale.billType}</td>
                <td className="px-4 py-2">₹{sale.grandTotal}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleView(sale)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(sale.date)}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(sale._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {sales.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No sale bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Sale Bill Details</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <p>
                <strong>Customer Name:</strong> {selectedBill.customerName}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedBill.customerMobile}
              </p>
              <p>
                <strong>Address:</strong> {selectedBill.customerAddress}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedBill.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Bill Type:</strong> {selectedBill.billType}
              </p>
              <p>
                <strong>Discount:</strong> {selectedBill.discountPercent}%
              </p>
              <p>
                <strong>Grand Total:</strong> ₹{selectedBill.grandTotal}
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <table className="w-full text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Qty</th>
                  <th className="py-2 px-2">Rate</th>
                  <th className="py-2 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items?.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-1 px-2">{item.name}</td>
                    <td className="py-1 px-2">
                      {item.qty} {item.unit}
                    </td>
                    <td className="py-1 px-2">₹{item.rate}</td>
                    <td className="py-1 px-2">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedBill(null)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSales;
