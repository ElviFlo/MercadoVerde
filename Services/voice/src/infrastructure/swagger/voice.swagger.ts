import type { Application, Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
// CommonJS para evitar default import issues con ts-node
const swaggerJsdoc: (opts: import("swagger-jsdoc").Options) => any = require("swagger-jsdoc");

export function setupSwagger(app: Application) {
  try {
    const PORT = process.env.PORT ?? "3006";
    const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

    const options: import("swagger-jsdoc").Options = {
      definition: {
        openapi: "3.0.3",
        info: {
          title: "MercadoVerde - Voice API",
          version: "1.0.0",
          description:
            "Procesamiento de comandos de voz. **/voice/command** requiere JWT (client o admin). **/voice/logs** solo admin. Tokens emitidos por `auth/`.",
        },
        servers: [{ url: `${HOST}:${PORT}` }],
        components: {
          securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
          },
          schemas: {
            CommandRequest: {
              type: "object",
              required: ["text"],
              properties: {
                text: { type: "string", example: "agrega dos manzanas rojas al carrito" },
                confidence: { type: "number", example: 0.92 },
                source: { type: "string", example: "mic" },
              },
            },
            CommandOk: {
              type: "object",
              properties: {
                status: { type: "string", example: "ok" },
                message: { type: "string", example: "Añadí 2 x 'Manzana Roja' al carrito" },
                productId: { type: "number", example: 123 },
                quantity: { type: "number", example: 2 },
              },
            },
            CommandAmbiguous: {
              type: "object",
              properties: {
                status: { type: "string", example: "ambiguous" },
                message: { type: "string", example: "Encontré varias coincidencias" },
                candidates: { type: "array", items: { type: "string" } },
              },
            },
            CommandRejected: {
              type: "object",
              properties: { status: { type: "string", example: "rejected" }, message: { type: "string" } },
            },
          },
        },
        paths: {
          "/voice/command": {
            post: {
              tags: ["voice"],
              summary: "Procesar comando",
              security: [{ bearerAuth: [] }],
              requestBody: {
                required: true,
                content: { "application/json": { schema: { $ref: "#/components/schemas/CommandRequest" } } },
              },
              responses: {
                "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/CommandOk" } } } },
                "401": { description: "Token ausente o inválido" },
                "403": { description: "Rechazado" },
                "422": { description: "Ambiguo" },
                "500": { description: "Error" },
              },
            },
          },
        },
      },
      apis: [],
    };

    const spec = swaggerJsdoc(options);
    app.get("/docs.json", (_req: Request, res: Response) => res.json(spec));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true, swaggerOptions: { persistAuthorization: true } }));
  } catch (err) {
    console.error("[voice] Error montando Swagger:", err);
  }
}
