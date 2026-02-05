const express = require('express');
const router = express.Router();
const {
    getUsers,
    getAllAdsAdmin,
    getPendingAds,
    updateAdStatus,
    banUser,
    activateSubscription,
    getAllSubscriptionsAdmin,
    getAdminDashboardStats
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', protect, adminOnly, getUsers);

/**
 * @swagger
 * /api/admin/ads:
 *   get:
 *     summary: Get all ads (including pending)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all ads
 */
router.get('/ads', protect, adminOnly, getAllAdsAdmin);

/**
 * @swagger
 * /api/admin/ads/pending:
 *   get:
 *     summary: Get pending ads (Daily Review)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending ads
 */
router.get('/ads/pending', protect, adminOnly, getPendingAds);

/**
 * @swagger
 * /api/admin/ads/{id}/status:
 *   put:
 *     summary: Update ad status (Approve/Reject)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, rejected] }
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Ad status updated
 */
router.put('/ads/:id/status', protect, adminOnly, updateAdStatus);

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   put:
 *     summary: Ban a user
 *     tags: [Admin]
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
 *         description: User banned
 */
router.put('/users/:id/ban', protect, adminOnly, banUser);

/**
 * @swagger
 * /api/admin/subscriptions/activate:
 *   post:
 *     summary: Manually activate user subscription
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, planId]
 *             properties:
 *               userId: { type: string }
 *               planId: { type: string }
 *               durationInDays: { type: number, default: 365 }
 *     responses:
 *       201:
 *         description: Subscription activated
 */
router.post('/subscriptions/activate', protect, adminOnly, activateSubscription);

/**
 * @swagger
 * /api/admin/subscriptions:
 *   get:
 *     summary: Get all user subscriptions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/subscriptions', protect, adminOnly, getAllSubscriptionsAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard money KPIs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', protect, adminOnly, getAdminDashboardStats);

module.exports = router;
