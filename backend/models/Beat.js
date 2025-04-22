const mongoose = require("mongoose");

const BeatSchema = new mongoose.Schema({
  beatName: { type: String, required: true },
});

module.exports = mongoose.model("Beat", BeatSchema);
