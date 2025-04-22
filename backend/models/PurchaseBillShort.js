const mongoose = require("mongoose");

const PurchaseBillShortSchema = new mongoose.Schema({
  partyName: { type: String, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  paymentMode: { type: String, enum: ["Cash", "Credit"], default: "Cash" },
  totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model("PurchaseBillShort", PurchaseBillShortSchema);