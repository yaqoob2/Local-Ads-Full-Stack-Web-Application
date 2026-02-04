const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testUser = {
    username: `atlas_user_${Date.now()}`,
    email: `atlas_${Date.now()}@test.com`,
    phone: `9${Date.now().toString().slice(-9)}`, // ensure 10 digits approximate
    password: 'password123',
    fullName: 'Atlas Test User'
};

const runTest = async () => {
    try {
        console.log('1. Testing Registration...');
        const registerRes = await axios.post(`${API_URL}/register`, testUser);
        console.log('✅ Registration Successful:', registerRes.status);
        console.log('User ID:', registerRes.data._id);

        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            login: testUser.email, // Controller expects 'login' field
            password: testUser.password
        });
        console.log('✅ Login Successful:', loginRes.status);
        console.log('Token received:', loginRes.data.token ? 'Yes' : 'No');

        console.log('\n🎉 Backend is fully functional with MongoDB Atlas!');

    } catch (error) {
        console.error('\n❌ Test Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
};

runTest();
