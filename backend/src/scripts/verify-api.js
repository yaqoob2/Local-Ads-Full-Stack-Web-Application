const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let categoryId = '';

const testFlow = async () => {
    try {
        console.log('🚀 Starting System Verification...\n');

        // 1. Health Check
        console.log('1️⃣  Checking API Health...');
        const health = await axios.get('http://localhost:5000');
        console.log('   ✅ Health:', health.data.message);

        // 2. Register User
        const randomUser = `user_${Math.floor(Math.random() * 10000)}`;
        console.log(`\n2️⃣  Registering User (${randomUser})...`);
        try {
            const register = await axios.post(`${API_URL}/auth/register`, {
                username: randomUser,
                phone: `${Math.floor(Math.random() * 1000000000)}`,
                email: `${randomUser}@example.com`,
                password: 'password123',
                fullName: 'Test User',
                role: 'ADVERTISER'
            });
            token = register.data.token;
            userId = register.data._id;
            console.log('   ✅ Registered:', register.data.username);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                console.log('   ⚠️  User likely exists, trying login...');
                // Fallback to login if user exists (for repeated runs)
                const login = await axios.post(`${API_URL}/auth/login`, {
                    login: `${randomUser}@example.com`,
                    password: 'password123'
                });
                token = login.data.token;
                userId = login.data._id;
                console.log('   ✅ Logged in (fallback):', login.data.username);
            } else {
                throw e;
            }
        }

        // 3. Login (Verify credentials)
        console.log('\n3️⃣  Verifying Login...');
        const login = await axios.post(`${API_URL}/auth/login`, {
            login: `${randomUser}`, // Testing username login
            password: 'password123'
        });
        console.log('   ✅ Login Successful. Token received.');

        // 4. Get Profile
        console.log('\n4️⃣  Fetching Profile...');
        const profile = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   ✅ Profile:', profile.data.profile.fullName);

        // 5. Get Categories & Templates (Meta)
        console.log('\n5️⃣  Fetching Meta Data...');
        const categories = await axios.get(`${API_URL}/meta/categories`);
        const templates = await axios.get(`${API_URL}/meta/templates`);

        if (categories.data.length > 0) {
            categoryId = categories.data[0]._id;
            console.log('   ✅ Categories found:', categories.data.length);
        } else {
            console.log('   ⚠️  No categories found. Run seed script first!');
            return;
        }

        let templateId = '';
        if (templates.data.length > 0) {
            templateId = templates.data[0]._id;
            console.log('   ✅ Templates found:', templates.data.length);
        } else {
            console.log('   ⚠️  No templates found. Run seed script first!');
            return;
        }

        // 6. Create Ad
        console.log('\n6️⃣  Creating Ad...');
        const ad = await axios.post(`${API_URL}/ads`, {
            category: categoryId,
            template: templateId,
            content: {
                title: 'Test Ad ' + new Date().toISOString(),
                description: 'This is a test ad description.',
                price: 100
            },
            location: {
                city: 'Test City'
            }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   ✅ Ad Created:', ad.data.content.title);

        // 7. Get My Ads
        console.log('\n7️⃣  Fetching My Ads...');
        const myAds = await axios.get(`${API_URL}/ads/myads`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   ✅ My Ads Count:', myAds.data.length);

        console.log('\n✅ Verification Complete! System is operational.');

    } catch (error) {
        console.error('\n❌ Verification Failed:', error.response ? error.response.data : error.message);
    }
};

testFlow();
