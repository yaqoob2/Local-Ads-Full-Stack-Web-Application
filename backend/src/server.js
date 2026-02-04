const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const paymentRoutes = require('./routes/payment.routes');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Mount routes
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
