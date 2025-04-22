const express = require("express");
const router = express.Router();
const PrinterSettings = require("../models/PrinterSettings");

// Get Printer Settings
router.get("/", async (req, res) => {
  try {
    const settings = await PrinterSettings.findOne();
    res.status(200).json(settings || { paperSize: "A4", printerName: "Default Printer" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Printer Settings
router.post("/", async (req, res) => {
  try {
    let settings = await PrinterSettings.findOne();
    if (settings) {
      settings.paperSize = req.body.paperSize;
      settings.printerName = req.body.printerName;
      await settings.save();
    } else {
      await PrinterSettings.create(req.body);
    }
    res.status(200).json({ message: "Printer settings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { handlePrintRequest } = require("../controllers/printerController");

router.post("/print", handlePrintRequest);

module.exports = router;
