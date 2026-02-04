const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const verifyLocation = async () => {
    try {
        console.log('🚀 Verifying Phase 5: Location API...\n');

        const testPincode = '400050'; // Bandra West, Mumbai
        console.log(`1️⃣  Fetching Details for Pincode: ${testPincode}...`);

        const response = await axios.get(`${API_URL}/locations/pincode/${testPincode}`);

        if (response.data.success) {
            console.log('   ✅ Success!');
            console.log(`      State: ${response.data.state}`);
            console.log(`      District: ${response.data.district}`);
            console.log(`      Areas found: ${response.data.areas.length}`);
            console.log(`      First Area: ${response.data.areas[0]}`);
        } else {
            console.log('   ❌ Failed: Success flag is false');
        }

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
};

verifyLocation();
