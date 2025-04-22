const express = require("express");
const router = express.Router();
const PurchaseBillShort = require("../models/PurchaseBillShort");
const PurchaseBillLong = require("../models/PurchaseBillLong");
router.post("/add", async (req, res) => {
  try {
    const { partyName, invoiceNumber, date, paymentMode, items } = req.body;
    if (
      !partyName ||
      !invoiceNumber ||
      !date ||
      !paymentMode ||
      !items?.length
    ) {
      return res.status(400).json({
        error: "All fields are required, and items cannot be empty.",
      });
    }
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.purchaseRate,
      0
    );
    const newBillShort = new PurchaseBillShort({
      partyName,
      invoiceNumber,
      date,
      paymentMode,
      totalAmount,
    });
    const savedBillShort = await newBillShort.save();
    const itemsData = items.map((item) => ({
      itemName: item.itemName,
      mrp: item.mrp,
      quantity: item.quantity,
      unit: item.unit,
      purchaseRate: item.purchaseRate,
      saleRate: item.saleRate,
      total: item.total,
      purchaseBillId: savedBillShort._id,
    }));
    await PurchaseBillLong.insertMany(itemsData);

    res.status(201).json({
      message: "Purchase Bill Added Successfully",
      billId: savedBillShort._id,
    });
  } catch (err) {
    console.error("❌ Error Adding Purchase Bill:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Duplicate invoice number. Please use a unique invoice number.",
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const purchaseBills = await PurchaseBillShort.find().sort({ date: -1 });
    res.json(purchaseBills);
  } catch (err) {
    console.error(" Error Fetching Purchase Bills:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const purchaseBill = await PurchaseBillShort.findById(req.params.id);
    if (!purchaseBill) {
      return res.status(404).json({ error: "Purchase Bill not found" });
    }
    const items = await PurchaseBillLong.find({
      purchaseBillId: req.params.id,
    });
    res.json({ purchaseBill, items });
  } catch (err) {
    console.error("Error Fetching Purchase Bill:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedBill = await PurchaseBillShort.findByIdAndDelete(
      req.params.id
    );
    if (!deletedBill) {
      return res.status(404).json({ error: "Purchase Bill not found" });
    }
    await PurchaseBillLong.deleteMany({ purchaseBillId: req.params.id });
    res.json({ message: "Purchase Bill Deleted Successfully" });
  } catch (err) {
    console.error(" Error Deleting Purchase Bill:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { partyName, invoiceNumber, date, paymentMode, items } = req.body;
    if (
      !partyName ||
      !invoiceNumber ||
      !date ||
      !paymentMode ||
      !items?.length
    ) {
      return res.status(400).json({
        error: "All fields are required, and items cannot be empty.",
      });
    }
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.purchaseRate,
      0
    );
    const updatedBillShort = await PurchaseBillShort.findByIdAndUpdate(
      req.params.id,
      { partyName, invoiceNumber, date, paymentMode, totalAmount },
      { new: true }
    );

    if (!updatedBillShort) {
      return res.status(404).json({ error: "Purchase Bill not found" });
    }
    await PurchaseBillLong.deleteMany({ purchaseBillId: req.params.id });
    const itemsData = items.map((item) => ({
      itemName: item.itemName,
      mrp: item.mrp,
      quantity: item.quantity,
      unit: item.unit,
      purchaseRate: item.purchaseRate,
      saleRate: item.saleRate,
      total: item.total,
      purchaseBillId: req.params.id,
    }));
    await PurchaseBillLong.insertMany(itemsData);

    res.json({
      message: "Purchase Bill Updated Successfully",
      updatedBill: updatedBillShort,
    });
  } catch (err) {
    console.error(" Error Updating Purchase Bill:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
