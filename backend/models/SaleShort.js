const mongoose = require("mongoose");

const SaleShortSchema = new mongoose.Schema({
  invoiceNumber: { type: String },
  customerName: { type: String, required: true },
  customerMobile: { type: String },
  customerAddress: { type: String },
  date: { type: Date, required: true },
  billType: { type: String, required: true },
  discountPercent: { type: Number },
  grandTotal: { type: Number, required: true },
});

module.exports = mongoose.model("SaleShort", SaleShortSchema);
