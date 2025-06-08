import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Service Documentation',
      version: '1.0.0',
      description: 'API documentation for the Next.js API Service',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  apis: [path.join(process.cwd(), 'src/app/api/**/*.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

// Ensure the directory exists
const outputDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the spec to a file
fs.writeFileSync(
  path.join(outputDir, 'swagger-spec.json'),
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('Swagger spec generated successfully!');
