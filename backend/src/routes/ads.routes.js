const express = require('express');
const router = express.Router();
const {
    createAd,
    getAds,
    getAdById,
    deleteAd,
    getMyAds,
    trackClick
} = require('../controllers/ads.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Advertisement management
 */

/**
 * @swagger
 * /api/ads:
 *   post:
 *     summary: Create a new ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category: { type: string }
 *               template: { type: string }
 *               content: { type: object }
 *               location: { type: object }
 *     responses:
 *       201:
 *         description: Ad created
 *   get:
 *     summary: Get all ads
 *     tags: [Ads]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by title/description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ads
 */
router.route('/').post(protect, createAd).get(getAds);

/**
 * @swagger
 * /api/ads/myads:
 *   get:
 *     summary: Get logged-in user's ads
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user ads
 */
router.route('/myads').get(protect, getMyAds);

/**
 * @swagger
 * /api/ads/{id}:
 *   get:
 *     summary: Get ad by ID
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad details
 *   delete:
 *     summary: Delete ad
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad removed
 */
router.route('/:id').get(getAdById).delete(protect, deleteAd);

/**
 * @swagger
 * /api/ads/{id}/click:
 *   put:
 *     summary: Track clicks (WhatsApp)
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string, enum: ['whatsapp'] }
 *     responses:
 *       200:
 *         description: Click counted
 */
router.put('/:id/click', trackClick);

module.exports = router;
