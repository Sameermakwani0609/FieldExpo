const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Category = require("../models/Category");
router.post("/add", async (req, res) => {
  try {
    const {
      itemName,
      mrp,
      purchaseRate,
      saleRate,
      quantity,
      quantityUnit,
      category,
    } = req.body;
    if (
      !itemName ||
      !mrp ||
      !purchaseRate ||
      !saleRate ||
      !quantity ||
      !quantityUnit ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: `Category with ID ${category} does not exist` });
    }
    const newItem = new Item({
      itemName,
      MRP: mrp,
      purchaseRate,
      saleRate,
      quantity,
      quantityUnit,
      category: categoryExists._id,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", data: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.get("/view-items", async (req, res) => {
  try {
    const items = await Item.find().populate("category", "name");
    res
      .status(200)
      .json({ message: "Items fetched successfully", data: items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.delete("/delete-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/update-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      itemName,
      mrp,
      purchaseRate,
      saleRate,
      quantity,
      quantityUnit,
      category,
    } = req.body;
    if (
      !itemName ||
      !mrp ||
      !purchaseRate ||
      !saleRate ||
      !quantity ||
      !quantityUnit ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        itemName,
        MRP: mrp,
        purchaseRate,
        saleRate,
        quantity,
        quantityUnit,
        category: categoryExists._id,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/get-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).populate("category", "name");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item fetched successfully", data: item });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
