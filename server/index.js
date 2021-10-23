const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const api = require('./api/index');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'test-service',
      version: '1.0.0',
      description: 'This is a microservice to process text with third party NLUs',
      contact: {
        name: 'Yasmina Gavaldà',
        email: 'y.gavalda@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}/v1/api`
      }
    ]
  },
  apis: ['./server/api/index.js']
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/v1/api', api);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
