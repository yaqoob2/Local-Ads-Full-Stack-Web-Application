const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const verifyMeta = async () => {
    try {
        console.log('🚀 Verifying Phase 4: Metadata Endpoints...\n');

        // 1. Templates
        console.log('1️⃣  Fetching Templates (/meta/templates)...');
        const templates = await axios.get(`${API_URL}/meta/templates`);
        if (templates.data.length > 0) {
            console.log(`   ✅ Success! Found ${templates.data.length} templates.`);
            console.log(`      First Template Key: ${templates.data[0].layoutKey}`);
        } else {
            console.log('   ⚠️  No templates found.');
        }

        // 2. Categories
        console.log('\n2️⃣  Fetching Categories (/meta/categories)...');
        const categories = await axios.get(`${API_URL}/meta/categories`);
        if (categories.data.length > 0) {
            console.log(`   ✅ Success! Found ${categories.data.length} categories.`);
        } else {
            console.log('   ⚠️  No categories found.');
        }

        // 3. Plans
        console.log('\n3️⃣  Fetching Plans (/subscription/plans)...');
        const plans = await axios.get(`${API_URL}/subscription/plans`);
        if (plans.data.length > 0) {
            console.log(`   ✅ Success! Found ${plans.data.length} plans.`);
        } else {
            console.log('   ⚠️  No plans found.');
        }

        console.log('\n✅ Phase 4 Verification Complete!');

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
};

verifyMeta();
