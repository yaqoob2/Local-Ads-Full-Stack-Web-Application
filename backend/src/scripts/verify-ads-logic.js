const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test User Credentials (from seed)
const USER_CREDENTIALS = {
    login: 'johndoe',
    password: 'password123'
};

const verifyAdsLogic = async () => {
    try {
        console.log('🚀 Verifying Phase 6: Ads Logic (Gating & Clicks)...\n');

        // 1. Login
        console.log('1️⃣  Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, USER_CREDENTIALS);
        const token = loginRes.data.token;
        console.log('   ✅ Logged in as:', loginRes.data.username);

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Fetch Metadata for Ad Creation
        const categories = await axios.get(`${API_URL}/meta/categories`);
        const catId = categories.data[0]._id;
        const templates = await axios.get(`${API_URL}/meta/templates`);
        const tempKey = templates.data[0].layoutKey; // Just verify we have checks, using key or ID depending on schema
        // Actually schema stores template ID, but frontend sends ID. 
        // Let's get the template ID directly if simpler, or just use one from the list
        // Note: The controller expects IDs for category and template refs
        // We need to fetch ID from the templates list, not just key. 
        // Wait, metadata endpoint returns objects?
        // Let's assume metadata endpoint returns full objects as per my earlier view of seed
        const tempId = templates.data[0]._id;

        // 3. Create First Ad (Should Succeed)
        console.log('\n2️⃣  Creating Ad #1 (Allowed)...');
        try {
            const adPayload = {
                category: catId,
                template: tempId,
                content: { title: "Ad 1", description: "First Ad" },
                location: { city: "Test City" }
            };
            const ad1 = await axios.post(`${API_URL}/ads`, adPayload, config);
            console.log(`   ✅ Ad Created! ID: ${ad1.data._id}`);

            // 4. Test WhatsApp Click
            console.log(`\n3️⃣  Testing WhatsApp Click on Ad #${ad1.data._id}...`);
            const clickRes = await axios.put(`${API_URL}/ads/${ad1.data._id}/click`, { type: 'whatsapp' });
            console.log(`   ✅ Click Tracked! New Count: ${clickRes.data.clicks}`);

        } catch (err) {
            // If it fails, maybe user already has max ads?
            console.log('   ⚠️  Could not create Ad #1 (Maybe limit already reached?):', err.response?.data?.message || err.message);
            // If we can't create, we verify gating by assuming we are at limit, 
            // but we can't test clicking unless we fetch 'my ads'.
        }

        // 5. Create Second Ad (Should FAIL due to Plan Limit of 1)
        console.log('\n4️⃣  Creating Ad #2 (Should FAIL - Plan Gating)...');
        try {
            const adPayload2 = {
                category: catId,
                template: tempId,
                content: { title: "Ad 2", description: "Second Ad" },
                location: { city: "Test City" }
            };
            await axios.post(`${API_URL}/ads`, adPayload2, config);
            console.log('   ❌ FAILED: Ad #2 was created but should have been blocked!');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(`   ✅ Success! Ad blocked: "${error.response.data.message}"`);
            } else {
                console.log('   ❌ Unexpected Error:', error.response ? error.response.data : error.message);
            }
        }

        console.log('\n✅ Ads Logic Verification Complete!');

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
};

verifyAdsLogic();
