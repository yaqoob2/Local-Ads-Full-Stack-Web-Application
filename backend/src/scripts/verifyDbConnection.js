const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const verifyConnection = async () => {
    console.log('Testing MongoDB connection...');
    console.log(`URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]{1,})@/, ':****@') : 'undefined'}`); // Log URI hiding password

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\n✅ SUCCESS: MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        await mongoose.disconnect();
        console.log('Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error(`\n❌ ERROR: MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

verifyConnection();
