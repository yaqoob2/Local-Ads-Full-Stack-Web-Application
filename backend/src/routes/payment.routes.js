const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment method management
 */

/**
 * @swagger
 * /api/payments/cards:
 *   post:
 *     summary: Add a new payment card
 *     description: Save a credit/debit card for the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardHolderName
 *               - cardNumber
 *               - expiryDate
 *               - cvv
 *             properties:
 *               cardHolderName:
 *                 type: string
 *               cardNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 example: "12/25"
 *               cvv:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card added successfully
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Server error
 */
router.post('/cards', protect, async (req, res) => {
    try {
        const { cardHolderName, cardNumber, expiryDate, cvv, type } = req.body;

        // Basic validation
        if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const newCard = new Card({
            user: req.user.id,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            type: type || 'Card'
        });

        const card = await newCard.save();
        res.json(card);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /api/payments/cards:
 *   get:
 *     summary: Get user cards
 *     description: Retrieve all saved payment cards for the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   cardHolderName:
 *                     type: string
 *                   cardNumber:
 *                     type: string
 *                   type:
 *                     type: string
 *                   expiryDate:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/cards', protect, async (req, res) => {
    try {
        const cards = await Card.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(cards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
