import type { Application } from "express";
import * as swaggerUi from "swagger-ui-express";

// ⚠️ Objeto OpenAPI estático, sin swagger-jsdoc
const specs = {
  openapi: "3.0.3",
  info: {
    title: "MercadoVerde - Voice API",
    version: "1.0.0",
    description:
      "Servicio de voz (Kora) para agregar productos al carrito mediante comandos de texto/voz.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT ?? "3006"}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/kora/command": {
      post: {
        summary:
          "Procesa un comando de voz o texto para agregar productos al carrito.",
        tags: ["Voice"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    example: "Agrega dos cafés molidos",
                  },
                },
                required: ["text"],
              },
            },
          },
        },
        responses: {
          200: { description: "Comando procesado correctamente." },
          400: { description: "Error en el comando recibido." },
        },
      },
    },
    "/api/kora/voice": {
      post: {
        summary:
          "Procesa un comando enviado como audio (archivo) para agregar productos al carrito.",
        tags: ["Voice"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  audio: {
                    type: "string",
                    format: "binary",
                    description:
                      "Archivo de audio (wav/mp3/webm) con la instrucción del usuario.",
                  },
                },
                required: ["audio"],
              },
            },
          },
        },
        responses: {
          200: { description: "Audio procesado correctamente." },
          400: {
            description:
              "Error en el archivo de audio o en el comando detectado.",
          },
        },
      },
    },
  },
};

export function setupSwagger(app: Application) {
  // Para debug: ver en logs qué paths ve Swagger
  console.log("🔍 Swagger Voice paths:", Object.keys(specs.paths));

  // JSON crudo para que lo veas en el navegador
  app.get("/docs-json", (_req, res) => {
    res.json(specs);
  });

  // UI de Swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
