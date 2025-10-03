import type { Application, Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerJsdoc: (opts: import("swagger-jsdoc").Options) => any = require("swagger-jsdoc");

export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3006";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const options: import("swagger-jsdoc").Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "MercadoVerde - Voice Service (Kora)",
        version: "1.0.0",
        description: "Servicio de voz que convierte voz→texto→acción.",
      },
      servers: [{ url: `${HOST}:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas: {
          AddToCartRequest: {
            type: "object",
            properties: {
              productId: { oneOf: [{ type: "integer", example: 1 }, { type: "string", example: "07f8a883-a691-4829-b671-ac8845a72961" }] },
              quantity: { type: "integer", example: 2 },
              inputText: { type: "string", example: "agrega dos cafes id 1" }
            }
          }
        }
      },
      tags: [{ name: "Voice" }, { name: "Kora" }],
      paths: {
        "/voice/add-to-cart": {
          post: {
            tags: ["Voice"],
            summary: "Agrega un producto al carrito (JWT)",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: { "application/json": { schema: { $ref: "#/components/schemas/AddToCartRequest" } } }
            },
            responses: { "200": { description: "OK" }, "401": { description: "Token requerido" }, "500": { description: "Error" } }
          }
        },
        "/kora/command": {
          post: {
            tags: ["Kora"],
            summary: "Procesa transcripción de voz",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: { "application/json": { schema: { type: "object", required: ["text"], properties: { text: { type: "string" }, userId: { type: "string", nullable: true }, confidence: { type: "number", nullable: true }, source: { type: "string", nullable: true } } } } }
            },
            responses: { "200": { description: "OK" }, "401": { description: "Auth" }, "422": { description: "Ambiguo" }, "500": { description: "Error" } }
          }
        }
      }
    },
    apis: [],
  };

  const spec = swaggerJsdoc(options);
  app.get("/docs.json", (_req: Request, res: Response) => res.json(spec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true, swaggerOptions: { persistAuthorization: true } }));
}
