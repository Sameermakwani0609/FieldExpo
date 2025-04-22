const express = require("express");
const Supplier = require("../models/Supplier");

const router = express.Router();
router.post("/", async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res
      .status(201)
      .json({ message: "Supplier added successfully", supplier: newSupplier });
  } catch (error) {
    console.error("Error saving supplier:", error);
    res
      .status(500)
      .json({ error: "Error adding supplier", details: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching suppliers", details: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });
    res.status(200).json(supplier);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching supplier", details: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({
        message: "Supplier updated successfully",
        supplier: updatedSupplier,
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating supplier", details: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting supplier", details: error.message });
  }
});

module.exports = router;
