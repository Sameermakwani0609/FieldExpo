import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreens";
import AddBeat from "./components/AddBeat";
import Category from "./components/Category";
import AddPurchase from "./components/AddPurchase";
import AddCustomer from "./components/AddCustomer";
import AddItem from "./components/AddItem";
import AddSale from "./components/AddSale";
import PurchaseBillList from "./components/PurchaseBillList"; // Purchase Bill List
import PurchaseBillDetails from "./components/PurchaseBillDetails"; // Purchase Bill Details
import SupplierList from "./components/SupplierList";
import EditSupplierForm from "./components/EditSupplierForm";
import ViewCategories from "./components/ViewCategories"; // Updated path
import EditCategory from "./components/EditCategory"; // Updated path
import ViewAllBeats from "./components/ViewAllBeats";
import EditBeat from "./components/EditBeat"; // Import EditBeat
import SupplierForm from "./components/SupplierForm"; // Import SupplierForm
import EditPurchase from "./components/EditPurchase";
import ViewPurchase from "./components/ViewPurchase";
import ViewItems from "./components/ViewItems";
import EditItem from "./components/EditItem"; // Import the EditItem component
import EditCustomer from "./components/EditCustomer"; // Import EditCustomer
import FirmDetails from "./components/FirmDetails";
import ViewFirmDetails from "./components/ViewFirmDetails"; // Import ViewFirmDetails
import EditFirm from "./components/EditFirm";
import ViewAllCustomer from "./components/ViewAllCustomer"; // Import ViewFirmDetails
import ViewSales from "./components/ViewSales";
import EditSaleBill from "./components/EditSaleBill";
// Printer Management
import PrinterSettings from "./components/PrinterSettings"; // Printer Settings Page
import BillPrint from "./components/PrintBill"; // Bill Printing Page
import { useState } from "react";
import { Edit } from "lucide-react";

const App = () => {
  const [printerSettings, setPrinterSettings] = useState({});

  const handleApplySettings = (settings) => {
    setPrinterSettings(settings);
    console.log("Settings applied in App.js:", settings);
  };

  return (
    <Router>
      <Routes>
        {/* Home Screen */}
        <Route path="/" element={<HomeScreen />} />

        {/* Beat Management */}
        <Route path="/add-beat" element={<AddBeat />} />
        <Route path="/view-beats" element={<ViewAllBeats />} />
        <Route path="/edit-beat/:id" element={<EditBeat />} />

        {/* Category Management */}
        <Route path="/add-category" element={<Category />} />
        <Route path="/view-categories" element={<ViewCategories />} />
        <Route path="/edit-category/:id" element={<EditCategory />} />

        {/* Purchase Management */}
        <Route path="/add-purchase" element={<AddPurchase />} />
        <Route path="/view-purchases" element={<PurchaseBillList />} />
        <Route path="/purchase/:id" element={<PurchaseBillDetails />} />
        <Route path="/edit-purchase/:id" element={<EditPurchase />} />
        <Route path="/view-purchase/:id" element={<ViewPurchase />} />

        {/* Customer Management */}
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/ViewCustomer" element={<ViewAllCustomer />} />
        <Route path="/update-customer/:id" element={<EditCustomer />} />

        {/* Item Management */}
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/view-item" element={<ViewItems />} />
        <Route path="/edit-item/:id" element={<EditItem />} />

        {/* Sale Management */}
        <Route path="/add-sale" element={<AddSale />} />
        <Route path="/view-sales" element={<ViewSales />} />
        <Route path="/edit-sale/:id" element={<EditSaleBill />} />

        {/* Supplier Management */}
        <Route path="/add-supplier" element={<SupplierForm />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/edit-supplier/:id" element={<EditSupplierForm />} />

        {/* Firm Management */}
        <Route path="/add-firm" element={<FirmDetails />} />
        <Route path="/view-firms" element={<ViewFirmDetails />} />
        <Route path="/edit-firm/:id" element={<EditFirm />} />

        {/* Printer Management */}
        <Route path="/printer-settings" element={<PrinterSettings />} />
        <Route path="/bill-print/:id" element={<BillPrint />} />
      </Routes>
    </Router>
  );
};
export default App;
