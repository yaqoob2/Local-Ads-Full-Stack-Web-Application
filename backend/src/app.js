const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { errorHandler } = require('./middleware/error');

// Route files
const adminRoutes = require('./routes/admin.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const adsRoutes = require('./routes/ads.routes');
const metaRoutes = require('./routes/meta.routes');
const locationRoutes = require('./routes/location.routes');

const app = express();

// Stripe Webhook (Must be before express.json() for raw body)
app.use('/api/webhook', require('./routes/webhook.routes'));

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health Endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'LocalConnect Ads API is running',
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/payments', require('./routes/payment.routes'));

// Error Handling
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use(errorHandler);

module.exports = app;
