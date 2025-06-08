import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Service Documentation',
      version: '1.0.0',
      description: 'API documentation for the Next.js API Service',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
