const express = require("express");
const router = express.Router();
const Beat = require("../models/Beat");
router.post("/add-beat", async (req, res) => {
  try {
    const { beatName } = req.body;
    if (
      !beatName ||
      typeof beatName !== "string" ||
      beatName.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Beat name must be a non-empty string" });
    }
    const newBeat = new Beat({ beatName: beatName.trim() });
    await newBeat.save();

    res.status(201).json({ message: "Beat added successfully" });
  } catch (err) {
    console.error("Error adding beat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/get-beats", async (req, res) => {
  try {
    const beats = await Beat.find();
    res.status(200).json(beats);
  } catch (err) {
    console.error("Error retrieving beats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.put("/edit-beat/:id", async (req, res) => {
  try {
    const { beatName } = req.body;
    const { id } = req.params;
    if (
      !beatName ||
      typeof beatName !== "string" ||
      beatName.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Beat name must be a non-empty string" });
    }
    await Beat.findByIdAndUpdate(id, { beatName: beatName.trim() });

    res.status(200).json({ message: "Beat updated successfully" });
  } catch (err) {
    console.error("Error updating beat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/delete-beat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Beat.findByIdAndDelete(id);
    res.status(200).json({ message: "Beat deleted successfully" });
  } catch (err) {
    console.error("Error deleting beat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/search-beats", async (req, res) => {
  try {
    const { query } = req.query;
    const beats = await Beat.find({
      beatName: { $regex: query, $options: "i" },
    });

    res.status(200).json(beats);
  } catch (err) {
    console.error("Error searching beats:", err);
    res.status(500).json({ error: "Failed to search beats" });
  }
});
router.put("/edit-beat/:id", async (req, res) => {
  try {
    const { beatName } = req.body;
    const { id } = req.params;
    if (
      !beatName ||
      typeof beatName !== "string" ||
      beatName.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Beat name must be a non-empty string" });
    }
    await Beat.findByIdAndUpdate(id, { beatName: beatName.trim() });

    res.status(200).json({ message: "Beat updated successfully" });
  } catch (err) {
    console.error("Error updating beat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/get-beat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const beat = await Beat.findById(id);
    if (!beat) {
      return res.status(404).json({ error: "Beat not found" });
    }
    res.status(200).json(beat);
  } catch (err) {
    console.error("Error fetching beat:", err);
    res.status(500).json({ error: "Failed to fetch beat" });
  }
});
module.exports = router;
