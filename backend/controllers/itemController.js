const Item = require("../models/Item");
const Category = require("../models/Category");

// Add a new item
exports.addItem = async (req, res) => {
    try {
        const { itemName, category, MRP, saleRate, quantity } = req.body;

        // Check if category exists
        const existingCategory = await Category.findOne({ categoryName: category });
        if (!existingCategory) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const newItem = new Item({ itemName, category, MRP, saleRate, quantity });
        await newItem.save();
        res.status(201).json({ success: true, message: "Item added successfully", item: newItem });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json({ success: true, items });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};