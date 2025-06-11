'use client';

import { useEffect, useState } from 'react';

export default function SwaggerUI() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSwaggerUI = async () => {
      try {
        // Load Swagger UI CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
        document.head.appendChild(link);

        // Load Swagger UI JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js';
        script.crossOrigin = 'anonymous';
        script.onload = async () => {
          try {
            const response = await fetch('/swagger.json');
            const spec = await response.json();

            // @ts-expect-error SwaggerUIBundle is loaded from external script
            window.SwaggerUIBundle({
              spec,
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                // @ts-expect-error SwaggerUIBundle is loaded from external script
                window.SwaggerUIBundle.presets.apis,
                // @ts-expect-error SwaggerUIBundle is loaded from external script
                window.SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
            });
            setIsLoading(false);
          } catch (error) {
            console.error('Error loading Swagger spec:', error);
            setIsLoading(false);
          }
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading Swagger UI:', error);
        setIsLoading(false);
      }
    };

    loadSwaggerUI();
  }, []);

  return (
    <div className="swagger-container">
      {isLoading && <div>Loading API Documentation...</div>}
      <div id="swagger-ui"></div>
    </div>
  );
}
