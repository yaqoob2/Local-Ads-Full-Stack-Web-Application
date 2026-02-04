const express = require('express');
const router = express.Router();
const {
    getCategories,
    getTemplates,
    getTemplatesByCategory,
} = require('../controllers/meta.controller');

/**
 * @swagger
 * tags:
 *   name: Meta
 *   description: Categories and Templates
 */

/**
 * @swagger
 * /api/meta/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /api/meta/templates:
 *   get:
 *     summary: Get all templates
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get('/templates', getTemplates);

/**
 * @swagger
 * /api/meta/templates/{categoryId}:
 *   get:
 *     summary: Get templates by category
 *     tags: [Meta]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of templates for category
 */
router.get('/templates/:categoryId', getTemplatesByCategory);

module.exports = router;
