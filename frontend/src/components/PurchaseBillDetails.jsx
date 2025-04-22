import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PurchaseBillDetails = () => {
  const { id } = useParams();
  const [purchaseBill, setPurchaseBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchaseBillDetails();
  }, [id]);

  const fetchPurchaseBillDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/purchase/${id}`);
      const data = await response.json();
      setPurchaseBill(data);
    } catch (error) {
      console.error("Error fetching purchase bill details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!purchaseBill) {
    return <div>Purchase bill not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Purchase Bill Details</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Bill Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="font-medium">Party Name:</p>
            <p>{purchaseBill.purchaseBill.partyName}</p>
          </div>
          <div>
            <p className="font-medium">Invoice Number:</p>
            <p>{purchaseBill.purchaseBill.invoiceNumber}</p>
          </div>
          <div>
            <p className="font-medium">Date:</p>
            <p>
              {new Date(purchaseBill.purchaseBill.date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-medium">Payment Mode:</p>
            <p>{purchaseBill.purchaseBill.paymentMode}</p>
          </div>
          <div>
            <p className="font-medium">Total Amount:</p>
            <p>{purchaseBill.purchaseBill.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Items</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Item Name</th>
              <th className="p-2">MRP</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Purchase Rate</th>
              <th className="p-2">Sale Rate</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseBill.purchaseItems.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.itemName}</td>
                <td className="p-2">{item.mrp}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.purchaseRate}</td>
                <td className="p-2">{item.saleRate}</td>
                <td className="p-2">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseBillDetails;
