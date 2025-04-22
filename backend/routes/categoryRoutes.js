const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
router.post("/add-category", async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName || typeof categoryName !== "string") {
      return res.status(400).json({ error: "Invalid category name" });
    }
    const existingCategory = await Category.findOne({ name: categoryName });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({
      name: categoryName,
    });
    await newCategory.save();

    res.status(201).json({ message: "Category saved successfully" });
  } catch (err) {
    console.error("Error saving category:", err);
    res.status(500).json({ error: "Failed to save category" });
  }
});
router.get("/get-categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
router.get("/get-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});
router.put("/update-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!categoryName || typeof categoryName !== "string") {
      return res.status(400).json({ error: "Invalid category name" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: categoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
});
router.delete("/delete-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});
router.get("/search-categories", async (req, res) => {
  try {
    const { query } = req.query;
    const categories = await Category.find({
      name: { $regex: query, $options: "i" },
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error("Error searching categories:", err);
    res.status(500).json({ error: "Failed to search categories" });
  }
});

module.exports = router;
