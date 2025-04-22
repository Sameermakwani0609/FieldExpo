const mongoose = require("mongoose");

const PurchaseBillLongSchema = new mongoose.Schema({
  purchaseBillId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "PurchaseBillShort",
  },
  itemName: { type: String, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  purchaseRate: { type: Number, required: true },
  saleRate: { type: Number, required: true },
  total: { type: Number, required: true },
});

module.exports = mongoose.model("PurchaseBillLong", PurchaseBillLongSchema);