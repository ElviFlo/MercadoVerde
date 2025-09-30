import type { Application, Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
// usa require con any para evitar tipos
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerJsdoc: any = require("swagger-jsdoc");

export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3002";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const options: any = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "MercadoVerde - Orders API",
        version: "1.0.0",
        description:
          "Crear/listar propias: **client**. Ver todas: **admin**. Detalle: **admin o dueño**.",
      },
      servers: [{ url: `${HOST}:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas: {
          CreateOrderRequest: {
            type: "object",
            required: ["items"],
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["productId", "quantity"],
                  properties: {
                    productId: { type: "integer", example: 1 },
                    quantity: { type: "integer", example: 2 },
                  },
                },
              },
            },
          },
        },
      },
      tags: [
        { name: "Orders - Client", description: "Acciones de cliente" },
        { name: "Orders - Admin", description: "Acciones administrativas" },
      ],
      paths: {
        "/orders": {
          post: {
            tags: ["Orders - Client"],
            security: [{ bearerAuth: [] }],
            summary: "Crear orden (client)",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateOrderRequest" },
                },
              },
            },
            responses: {
              "201": { description: "Creada" },
              "400": { description: "Body inválido" },
              "401": { description: "No autenticado" },
              "403": { description: "Requiere rol client" },
            },
          },
          get: {
            tags: ["Orders - Admin"],
            security: [{ bearerAuth: [] }],
            summary: "Listar todas (admin)",
            responses: {
              "200": { description: "OK" },
              "401": { description: "No autenticado" },
              "403": { description: "Requiere rol admin" },
            },
          },
        },
        "/orders/mine": {
          get: {
            tags: ["Orders - Client"],
            security: [{ bearerAuth: [] }],
            summary: "Listar mis órdenes (client)",
            responses: {
              "200": { description: "OK" },
              "401": { description: "No autenticado" },
              "403": { description: "Requiere rol client" },
            },
          },
        },
        "/orders/{id}": {
          get: {
            tags: ["Orders - Client"],
            security: [{ bearerAuth: [] }],
            summary: "Detalle (admin o dueño)",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" },
              },
            ],
            responses: {
              "200": { description: "OK" },
              "401": { description: "No autenticado" },
              "403": { description: "No autorizado" },
              "404": { description: "No encontrada" },
            },
          },
        },
      },
    },
    apis: [],
  };

  const spec = swaggerJsdoc(options);
  app.get("/docs.json", (_req: Request, res: Response) => res.json(spec));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      explorer: true,
      swaggerOptions: { persistAuthorization: true },
    }),
  );
}
