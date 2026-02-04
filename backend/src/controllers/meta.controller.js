const Category = require('../models/Category');
const Template = require('../models/Template');

// @desc    Get all categories
// @route   GET /api/meta/categories
// @access  Public
const getCategories = async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
};

// @desc    Get all templates
// @route   GET /api/meta/templates
// @access  Public
const getTemplates = async (req, res) => {
    const templates = await Template.find({}).populate('category', 'name');
    res.json(templates);
};

// @desc    Get templates by category
// @route   GET /api/meta/templates/:categoryId
// @access  Public
const getTemplatesByCategory = async (req, res) => {
    const templates = await Template.find({ category: req.params.categoryId });
    res.json(templates);
};

module.exports = {
    getCategories,
    getTemplates,
    getTemplatesByCategory,
};
