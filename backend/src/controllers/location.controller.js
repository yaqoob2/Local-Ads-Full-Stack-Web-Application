const axios = require('axios');

// @desc    Get details by pincode (India)
// @route   GET /api/locations/pincode/:pincode
// @access  Public
const getPincodeDetails = async (req, res) => {
    const { pincode } = req.params;

    // Basic validation
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
        res.status(400);
        throw new Error('Invalid Pincode. It should be a 6-digit number.');
    }

    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = response.data[0];

        if (data.Status === 'Success') {
            const postOffices = data.PostOffice;

            // Extract unique areas, state, district
            // Assuming State and District are consistent across the array
            const state = postOffices[0].State;
            const district = postOffices[0].District;

            // Map areas (Post Office names)
            const areas = postOffices.map(po => po.Name);

            res.json({
                success: true,
                pincode,
                state,
                district,
                areas
            });
        } else {
            res.status(404);
            throw new Error('Pincode not found');
        }

    } catch (error) {
        console.error(error);
        if (error.response) {
            res.status(error.response.status).json({ message: 'External API Error' });
        } else {
            res.status(500);
            throw new Error('Failed to fetch location details');
        }
    }
};

const statesDistricts = require('../data/states-districts.json');

// ... (getPincodeDetails implementation remains same) ...

// @desc    Get all states
// @route   GET /api/locations/states
// @access  Public
const getStates = (req, res) => {
    const states = statesDistricts.map(item => item.state);
    res.json(states);
};

// @desc    Get districts for a state
// @route   GET /api/locations/districts/:state
// @access  Public
const getDistricts = (req, res) => {
    const { state } = req.params;
    const stateData = statesDistricts.find(item => item.state.toLowerCase() === state.toLowerCase());

    if (stateData) {
        res.json(stateData.districts);
    } else {
        res.status(404);
        throw new Error('State not found');
    }
};

module.exports = {
    getPincodeDetails,
    getStates,
    getDistricts
};
