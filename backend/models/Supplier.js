const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  firmName: { type: String, required: true },
  supplierName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
