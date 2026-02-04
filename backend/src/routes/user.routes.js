const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the profile information for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.put('/profile', protect, updateUserProfile);

module.exports = router;
