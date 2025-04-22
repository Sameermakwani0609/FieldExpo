import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const [firmName, setFirmName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get today's date in IST
    const todayIST = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Fetch all sales and filter by today's date
    fetch("http://localhost:5000/api/sales/get-all")
      .then((res) => res.json())
      .then((data) => {
        const todaySales = data.filter((sale) => {
          const saleDateIST = new Date(sale.date).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          return saleDateIST === todayIST;
        });

        const total = todaySales.reduce(
          (sum, sale) => sum + sale.grandTotal,
          0
        );
        setTotalAmount(total);
      });

    fetch("http://localhost:5000/api/get-customers")
      .then((res) => res.json())
      .then((data) => setTotalCustomers(data.length));

    fetch("http://localhost:5000/api/items/view-items")
      .then((res) => res.json())
      .then((data) => setTotalItems(data.data.length));

    fetch("http://localhost:5000/api/get-beats")
      .then((res) => res.json())
      .then((data) => setTotalBeats(data.length));

    fetch("http://localhost:5000/api/firm")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.firmName) {
          setFirmName(data.firmName);
        }
      });
  }, []);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    { title: "Home", icon: "🏠", route: "/" },
    {
      title: "Category",
      icon: "📂",
      subItems: [
        { title: "➕ Add Category", route: "/add-category" },
        { title: "📄 View Categories", route: "/view-categories" },
      ],
    },
    {
      title: "Beat",
      icon: "🗠",
      subItems: [
        { title: "➕ Add Beat", route: "/add-beat" },
        { title: "📄 View Beat", route: "/view-beats" },
      ],
    },
    {
      title: "Purchase",
      icon: "🛒",
      subItems: [
        { title: "➕ Add Supplier", route: "/add-supplier" },
        { title: "📄 View Supplier", route: "/suppliers" },
        { title: "➕ Add Purchase", route: "/add-purchase" },
        { title: "📄 View Purchases", route: "/view-purchases" },
      ],
    },
    {
      title: "Item",
      icon: "📦",
      subItems: [
        { title: "➕ Add Item", route: "/add-item" },
        { title: "📄 View Items", route: "/view-item" },
      ],
    },
    {
      title: "Customer",
      icon: "👤",
      subItems: [
        { title: "➕ Add Customer", route: "/add-customer" },
        { title: "📄 View Customers", route: "/ViewCustomer" },
      ],
    },
    {
      title: "Sale",
      icon: "💰",
      subItems: [
        { title: "➕ Add Sale", route: "/add-sale" },
        { title: "📄 View Sales", route: "/view-sales" },
      ],
    },
    {
      title: "Firm Details",
      icon: "🏢",
      subItems: [
        { title: "➕ Add Firm", route: "/add-firm" },
        { title: "📄 View Firms", route: "/view-firms" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-md">
        <h2 className="text-xl font-bold mb-8 text-indigo-300">
          {firmName || "Firm Dashboard"}
        </h2>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <div
                  className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() =>
                    item.subItems
                      ? toggleDropdown(item.title)
                      : handleNavigation(item.route)
                  }
                >
                  <span className="text-lg mr-2">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                {item.subItems && activeDropdown === item.title && (
                  <ul className="ml-6 mt-1 bg-gray-800 rounded p-2 space-y-1">
                    {item.subItems.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        className="cursor-pointer hover:bg-gray-700 p-1 rounded"
                        onClick={() => handleNavigation(sub.route)}
                      >
                        {sub.title}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">Welcome to Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sales */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 p-6 rounded-xl shadow text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <h2 className="text-lg font-semibold">Today's Sales</h2>
              <p className="text-3xl font-bold mt-2">{totalAmount} INR</p>
              <p className="text-xs mt-2 black-70">Updated today (IST)</p>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 p-6 rounded-xl shadow text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <h2 className="text-lg font-semibold">Total Customers</h2>
              <p className="text-3xl font-bold mt-2">{totalCustomers}</p>
              <p className="text-xs mt-2 black-70">Active customers</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-400 p-6 rounded-xl shadow text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <h2 className="text-lg font-semibold">Total Items</h2>
              <p className="text-3xl font-bold mt-2">{totalItems}</p>
              <p className="text-xs mt-2 opacity-70">In inventory</p>
            </div>
          </div>

          {/* Beats */}
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-400 p-6 rounded-xl shadow text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">🗠</div>
              <h2 className="text-lg font-semibold">Total Beats</h2>
              <p className="text-3xl font-bold mt-2">{totalBeats}</p>
              <p className="text-xs mt-2 opacity-70">Assigned areas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
