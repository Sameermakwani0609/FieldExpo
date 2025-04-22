const express = require("express");
const { body, validationResult } = require("express-validator");
const SaleShort = require("../models/SaleLong");
const SaleLong = require("../models/SaleShort");

const router = express.Router();

const validateSaleInput = [
  body("saleShort.customerName")
    .notEmpty()
    .withMessage("Customer name is required"),
  body("saleShort.date").notEmpty().withMessage("Date is required"),
  body("saleShort.billType").notEmpty().withMessage("Bill type is required"),
  body("saleShort.grandTotal")
    .isNumeric()
    .withMessage("Grand total must be a number"),
  body("saleLong")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
];

router.post("/add-sale", validateSaleInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const saleShort = new SaleShort(req.body.saleShort);
    const savedShort = await saleShort.save();

    const saleLongData = req.body.saleLong.map((item) => ({
      ...item,
      saleId: savedShort._id,
    }));

    await SaleLong.insertMany(saleLongData);
    res.status(201).json({ message: "Sale saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
