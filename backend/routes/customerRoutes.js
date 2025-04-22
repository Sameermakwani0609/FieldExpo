const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Beat = require("../models/Beat");
router.post("/add-customer", async (req, res) => {
  try {
    const { customerName, customerAddress, customerMobile, route } = req.body;

    const newCustomer = new Customer({
      customerName,
      customerAddress,
      customerMobile,
      route,
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer added successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add customer", details: error.message });
  }
});
router.get("/get-customers", async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch customers", details: error.message });
  }
});
router.get("/get-customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch customer", details: error.message });
  }
});
router.put("/update-customer/:id", async (req, res) => {
  try {
    const { customerName, customerAddress, customerMobile, route } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { customerName, customerAddress, customerMobile, route },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully!",
      customer: updatedCustomer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update customer", details: error.message });
  }
});
router.delete("/delete-customer/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete customer", details: error.message });
  }
});
router.get("/get-beats", async (req, res) => {
  try {
    const beats = await Beat.find({});
    res.status(200).json(beats);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch beats", details: error.message });
  }
});

module.exports = router;
