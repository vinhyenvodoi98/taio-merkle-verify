import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Merkle Tree API',
      version: '1.0.0',
      description: 'API for Merkle tree operations',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

// Ensure the public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the swagger spec to a file
fs.writeFileSync(
  path.join(publicDir, 'swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('Swagger spec generated successfully!');
