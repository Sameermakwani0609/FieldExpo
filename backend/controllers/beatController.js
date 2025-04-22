const Beat = require("../models/Beat");

// Add a new beat
exports.addBeat = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if beat already exists
        const existingBeat = await Beat.findOne({ name });
        if (existingBeat) {
            return res.status(400).json({ error: "Beat already exists" });
        }

        const newBeat = new Beat({ name });
        await newBeat.save();
        res.status(201).json({ success: true, message: "Beat added successfully", beat: newBeat });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get all beats
exports.getBeats = async (req, res) => {
    try {
        const beats = await Beat.find();
        res.json({ success: true, beats });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};