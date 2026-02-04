const express = require('express');
const router = express.Router();
const {
    getPlans,
    createSubscription,
} = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Plans and Subscriptions
 */

/**
 * @swagger
 * /api/subscription/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: List of plans
 */
router.get('/plans', getPlans);

/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planId]
 *             properties:
 *               planId: { type: string }
 *     responses:
 *       201:
 *         description: Subscription created
 */
router.post('/', protect, createSubscription);

module.exports = router;
