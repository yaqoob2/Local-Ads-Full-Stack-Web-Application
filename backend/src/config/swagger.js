const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LocalConnect Ads API',
            version: '1.0.0',
            description: 'API documentation for LocalConnect Ads platform',
            contact: {
                name: 'Developer',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        tags: [
            { name: 'Admin', description: 'Admin management endpoints' },
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management' },
            { name: 'Subscription', description: 'Plans and Subscriptions' },
            { name: 'Ads', description: 'Advertisement management' },
            { name: 'Meta', description: 'Categories and Templates' },
            { name: 'Location', description: 'Location and Pincode services' },
            { name: 'Payments', description: 'Payment method management' },
            { name: 'Health', description: 'API Health Check' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        username: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        role: { type: 'string', enum: ['USER', 'ADVERTISER', 'ADMIN'] },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/app.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
