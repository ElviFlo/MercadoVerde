import type { Application, Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
// CommonJS require para evitar issues con default import
const swaggerJsdoc: (
  opts: import("swagger-jsdoc").Options,
) => any = require("swagger-jsdoc");

export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3003";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const idParam = {
    name: "id",
    in: "path",
    required: true,
    schema: { type: "string", example: "h4lqwzif6u" },
    description: "ID del producto (string, ej. uuid)",
  };

  const options: import("swagger-jsdoc").Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "MercadoVerde - Products API",
        version: "1.0.0",
        description:
          "Lectura disponible para **client** y **admin** (token requerido). Mutaciones (create/update/delete) **solo admin**. Los tokens deben ser emitidos por `auth/` con el **mismo** `JWT_SECRET`/`JWT_ISS`/`JWT_AUD`.",
      },
      servers: [{ url: `${HOST}:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas: {
          Product: {
            type: "object",
            properties: {
              id: { type: "string", example: "h4lqwzif6u" },
              name: { type: "string", example: "Monstera deliciosa (Swiss Cheese Plant)" },
              price: { type: "number", example: 39.99 },
              stock: { type: "integer", example: 12 },
              description: {
                type: "string",
                nullable: true,
                example: "Iconic indoor plant with large split leaves.",
              },
              type: {
                type: "string",
                example: "indoor",
                description: "Category/type of plant: indoor, outdoor, succulent, cacti, aromatic, flowering",
              },
              imageUrl: {
                type: "string",
                example: "/plants/plant-1.png",
              },
            },
          },
          CreateProductRequest: {
            type: "object",
            required: ["name", "price", "stock", "type"],
            properties: {
              name: { type: "string", example: "Monstera deliciosa (Swiss Cheese Plant)" },
              price: { type: "number", example: 39.99 },
              stock: { type: "integer", example: 12 },
              description: {
                type: "string",
                nullable: true,
                example: "Iconic indoor plant with large split leaves.",
              },
              type: {
                type: "string",
                example: "indoor",
                description: "indoor | outdoor | succulent | cacti | aromatic | flowering",
              },
              imageUrl: {
                type: "string",
                nullable: true,
                example: "/plants/plant-1.png",
              },
            },
          },
          UpdateProductRequest: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "number" },
              stock: { type: "integer" },
              description: { type: "string", nullable: true },
              type: {
                type: "string",
                example: "indoor",
              },
              imageUrl: {
                type: "string",
                nullable: true,
                example: "/plants/plant-1.png",
              },
            },
          },
          MessageResponse: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
      tags: [
        {
          name: "Products - Client",
          description: "Lectura (requiere client o admin autenticado)",
        },
        {
          name: "Products - Admin",
          description: "Mutaciones (solo admin)",
        },
      ],
      paths: {
        "/products": {
          get: {
            tags: ["Products - Client"],
            summary: "Listar productos",
            description:
              "Requiere token válido. Acepta **client** (aud=JWT_AUD) o **admin** (iss=JWT_ISS).",
            security: [{ bearerAuth: [] }],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
                  },
                },
              },
              "401": { description: "No autenticado" },
              "403": { description: "Prohibido (rol inválido)" },
            },
          },
          post: {
            tags: ["Products - Admin"],
            summary: "Crear producto (admin)",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CreateProductRequest" },
                },
              },
            },
            responses: {
              "201": {
                description: "Creado",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
              "401": { description: "No autenticado" },
              "403": { description: "Requiere rol admin" },
              "400": { description: "Body inválido" },
            },
          },
        },

        "/products/{id}": {
          get: {
            tags: ["Products - Client"],
            summary: "Obtener producto por id",
            description: "Requiere token válido. Acepta **client** o **admin**.",
            security: [{ bearerAuth: [] }],
            parameters: [idParam],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/Product" } },
                },
              },
              "401": { description: "No autenticado" },
              "403": { description: "Prohibido (rol inválido)" },
              "404": { description: "No encontrado" },
            },
          },
          put: {
            tags: ["Products - Admin"],
            summary: "Actualizar producto (admin)",
            security: [{ bearerAuth: [] }],
            parameters: [idParam],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UpdateProductRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Actualizado",
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/Product" } },
                },
              },
              "401": { description: "No autenticado" },
              "403": { description: "Requiere rol admin" },
              "404": { description: "No encontrado" },
            },
          },
          delete: {
            tags: ["Products - Admin"],
            summary: "Eliminar producto (admin)",
            security: [{ bearerAuth: [] }],
            parameters: [idParam],
            responses: {
              "204": { description: "Eliminado" },
              "401": { description: "No autenticado" },
              "403": { description: "Requiere rol admin" },
              "404": { description: "No encontrado" },
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
