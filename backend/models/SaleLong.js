const mongoose = require("mongoose");

const SaleLongSchema = new mongoose.Schema({
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SaleShort",
    required: true,
  },
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  qty: { type: Number, required: true },
  unit: { type: String },
  total: { type: Number, required: true },
});

module.exports = mongoose.model("SaleLong", SaleLongSchema);
