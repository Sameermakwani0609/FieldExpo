const mongoose = require("mongoose");

const printerSettingsSchema = new mongoose.Schema({
  paperSize: { type: String, default: "A4" },
  printerName: { type: String, default: "Default Printer" },
});

module.exports = mongoose.model("PrinterSettings", printerSettingsSchema);
