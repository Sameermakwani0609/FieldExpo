const Category = require("../models/Category");

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ categoryName });
    await newCategory.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Category added successfully",
        category: newCategory,
      });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
