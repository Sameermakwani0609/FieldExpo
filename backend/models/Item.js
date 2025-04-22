const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  MRP: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaseRate: {
    type: Number,
    required: true,
    min: 0,
  },
  saleRate: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  quantityUnit: {
    type: String,
    required: true,
    enum: ["units", "kg", "liters", "packs"],
  },
});

module.exports = mongoose.model("Item", itemSchema);
