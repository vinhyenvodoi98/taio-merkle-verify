import { swaggerSpec } from './swagger';

export function getSwaggerUiHtml() {
  // Ensure swaggerSpec is properly stringified and escaped
  const specString = JSON.stringify(swaggerSpec)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/"/g, '\\"');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="SwaggerUI" />
      <title>SwaggerUI</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
      <script>
        window.onload = () => {
          const spec = JSON.parse('${specString}');
          window.ui = SwaggerUIBundle({
            spec,
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
            supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
          });
        };
      </script>
    </body>
    </html>
  `;
}
