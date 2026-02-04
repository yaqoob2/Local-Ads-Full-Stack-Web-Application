const express = require('express');
const router = express.Router();
const { getPincodeDetails, getStates, getDistricts } = require('../controllers/location.controller');

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: Location and Pincode services
 */

/**
 * @swagger
 * /api/locations/states:
 *   get:
 *     summary: Get all states
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: List of states
 */
router.get('/states', getStates);

/**
 * @swagger
 * /api/locations/districts/{state}:
 *   get:
 *     summary: Get districts for a state
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of districts
 *       404:
 *         description: State not found
 */
router.get('/districts/:state', getDistricts);

/**
 * @swagger
 * /api/locations/pincode/{pincode}:
 *   get:
 *     summary: Get details for a Pincode (India)
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: pincode
 *         required: true
 *         schema:
 *           type: string
 *         description: 6-digit Indian Pincode
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 state: { type: string }
 *                 district: { type: string }
 *                 areas: 
 *                   type: array
 *                   items: { type: string }
 *       400:
 *         description: Invalid Pincode
 *       404:
 *         description: Pincode not found
 */
router.get('/pincode/:pincode', getPincodeDetails);

module.exports = router;
