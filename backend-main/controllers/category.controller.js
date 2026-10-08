const Category = require("../models/category.model");

const DEFAULT_CATEGORIES = [
  "Lifestyle",
  "Beauty",
  "Fashion",
  "Gaming",
  "Food",
  "Travel",
  "Tech",
  "Fitness",
];

const ensureDefaultCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((name) => ({ name })));
  }
};

const getCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }
    const existing = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }
    const category = await Category.create({ name });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCategories, createCategory, deleteCategory, ensureDefaultCategories };
