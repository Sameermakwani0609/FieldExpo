const PrinterSettings = require("../models/PrinterSettings");

exports.saveSettings = async (req, res) => {
  try {
    const { paperSize, printerName } = req.body;
    let settings = await PrinterSettings.findOne();
    if (settings) {
      settings.paperSize = paperSize;
      settings.printerName = printerName;
      await settings.save();
    } else {
      settings = new PrinterSettings({ paperSize, printerName });
      await settings.save();
    }
    res.json({ success: true, message: "Settings saved successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await PrinterSettings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.handlePrintRequest = async (req, res) => {
  try {
    const { billData, printerSettings } = req.body;

    // Here you can use printerSettings to adjust the printing options
    // For example, you can use a different printing library or API
    // to handle the printing based on the printer settings.

    console.log("Received print request:", billData, printerSettings);

    res.json({ success: true, message: "Print request received" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
