// Services/products/src/infrastructure/swagger/product.swagger.ts
import type { Application, Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
// CommonJS require para evitar issues de tipos/import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerJsdoc: (opts: import("swagger-jsdoc").Options) => any = require("swagger-jsdoc");

export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3003";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const options: import("swagger-jsdoc").Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "MercadoVerde - Products API",
        version: "1.0.0",
        description: "CRUD de productos protegido con JWT",
      },
      servers: [{ url: `${HOST}:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas: {
          ErrorResponse: {
            type: "object",
            properties: { message: { type: "string", example: "Producto no encontrado" } },
          },
          Product: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },                  // ← entero
              name: { type: "string", example: "Café orgánico" },
              description: { type: "string", nullable: true, example: "Tueste medio, 500g" },
              price: { type: "number", example: 19.99 },
              stock: { type: "integer", example: 50 },
              createdBy: { type: "string", example: "u_123" },
              createdAt: { type: "string", example: "2025-09-29T21:20:00.000Z" },
              updatedAt: { type: "string", example: "2025-09-29T21:20:00.000Z" },
            },
          },
          CreateProductRequest: {
            type: "object",
            required: ["name", "price"],
            properties: {
              name: { type: "string", example: "Café orgánico" },
              price: { type: "number", example: 19.99 },
              stock: { type: "integer", example: 50 },
              description: { type: "string", nullable: true, example: "Tueste medio, 500g" },
            },
          },
          UpdateProductRequest: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "number" },
              stock: { type: "integer" },
              description: { type: "string", nullable: true },
            },
          },
        },
      },
      tags: [{ name: "Products" }],
      paths: {
        "/products": {
          get: {
            tags: ["Products"],
            security: [{ bearerAuth: [] }],
            summary: "Listar productos",
            responses: {
              "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } },
              "401": { description: "No autenticado" },
            },
          },
          post: {
            tags: ["Products"],
            security: [{ bearerAuth: [] }],
            summary: "Crear producto",
            requestBody: {
              required: true,
              content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProductRequest" } } },
            },
            responses: {
              "201": { description: "Creado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
              "400": { description: "Body inválido" },
              "401": { description: "No autenticado" },
            },
          },
        },
        "/products/{id}": {
          get: {
            tags: ["Products"],
            security: [{ bearerAuth: [] }],
            summary: "Obtener producto",
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
            responses: {
              "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
              "404": { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
          put: {
            tags: ["Products"],
            security: [{ bearerAuth: [] }],
            summary: "Actualizar producto",
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
            requestBody: {
              required: true,
              content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProductRequest" } } },
            },
            responses: {
              "200": { description: "Actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
              "404": { description: "No encontrado" },
            },
          },
          delete: {
            tags: ["Products"],
            security: [{ bearerAuth: [] }],
            summary: "Eliminar producto",
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
            responses: { "204": { description: "Eliminado" }, "404": { description: "No encontrado" } },
          },
        },
      },
    },
    apis: [],
  };

  const spec = swaggerJsdoc(options);

  app.get("/docs.json", (_req: Request, res: Response) => res.json(spec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, { explorer: true, swaggerOptions: { persistAuthorization: true } }));
}
