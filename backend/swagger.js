const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Foodies API',
    version: '1.0.0',
    description: 'REST API documentation for the Foodies platform.',
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL || 'http://localhost:5000/api/v1',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, 'routes/*.js')],
};

module.exports = swaggerJSDoc(options);
