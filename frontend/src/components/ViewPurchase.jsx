import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const ViewPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchaseBill, setPurchaseBill] = useState(null);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchPurchaseBill = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/purchase/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch purchase bill details.");
        }
        const data = await response.json();
        setPurchaseBill(data.purchaseBill);
        setItems(data.items);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseBill();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  if (!purchaseBill) {
    return <p className="text-gray-500 text-center mt-8">No data found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Purchase Bill Details
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <p>
            <strong>Invoice Number:</strong> {purchaseBill.invoiceNumber}
          </p>
          <p>
            <strong>Party Name:</strong> {purchaseBill.partyName}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(purchaseBill.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Payment Mode:</strong> {purchaseBill.paymentMode}
          </p>
          <p>
            <strong>Total Amount:</strong> {purchaseBill.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Items</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Item Name</th>
              <th className="p-2">MRP</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Purchase Rate</th>
              <th className="p-2">Sale Rate</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-2">{item.itemName}</td>
                  <td className="p-2">{item.mrp}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.unit}</td>
                  <td className="p-2">{item.purchaseRate}</td>
                  <td className="p-2">{item.saleRate}</td>
                  <td className="p-2">{item.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <button
          onClick={() => navigate("/purchase-bills")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Purchase Bills
        </button>
      </div>
    </div>
  );
};

export default ViewPurchase;
