const mongoose = require("mongoose");

const FirmSchema = new mongoose.Schema({
  firmName: String,
  shopAddress: String,
  mobileNumber: String,
  billTitle: String,
  tagline: String,
  logo: String,
});

module.exports = mongoose.model("Firm", FirmSchema);
