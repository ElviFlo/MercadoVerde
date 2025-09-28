import type { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3003";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const options: swaggerJsdoc.Options = {
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
            properties: { message: { type: "string", example: "Producto no encontrado" } }
          },
          Product: {
            type: "object",
            properties: {
              id: { type: "string", example: "3c3f85e8-5b3e-4b4e-8d3d-1b2c9f9f5a1d" },
              name: { type: "string", example: "Café" },
              description: { type: "string", nullable: true, example: "Tostado medio" },
              price: { type: "number", example: 12000 },
              createdBy: { type: "string", example: "u_1" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          CreateProductRequest: {
            type: "object",
            required: ["name", "price"],
            properties: {
              name: { type: "string", example: "Café" },
              description: { type: "string", example: "Tostado medio" },
              price: { type: "number", example: 12000 },
            },
          },
          UpdateProductRequest: {
            type: "object",
            properties: {
              name: { type: "string", example: "Café orgánico" },
              description: { type: "string", example: "Tostado medio" },
              price: { type: "number", example: 15000 },
            },
          },
        },
      },
      paths: {
        "/products": {
          get: {
            tags: ["Products"],
            summary: "Listar productos",
            security: [{ bearerAuth: [] }],
            responses: {
              "200": {
                description: "OK",
                content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } },
              },
            },
          },
          post: {
            tags: ["Products"],
            summary: "Crear producto",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProductRequest" } } },
            },
            responses: {
              "201": { description: "Creado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
              "400": { description: "Solicitud inválida", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
              "401": { description: "Token requerido" },
              "403": { description: "Token inválido" },
            },
          },
        },
        "/products/{id}": {
          get: {
            tags: ["Products"],
            summary: "Obtener por id",
            security: [{ bearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
              "404": { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
          put: {
            tags: ["Products"],
            summary: "Actualizar",
            security: [{ bearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: {
              required: true,
              content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProductRequest" } } },
            },
            responses: {
              "200": { description: "Actualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
              "404": { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
          delete: {
            tags: ["Products"],
            summary: "Eliminar",
            security: [{ bearerAuth: [] }],
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Eliminado" },
              "404": { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            },
          },
        },
      },
      tags: [{ name: "Products" }],
    },
    apis: [], // si quieres, luego agregamos anotaciones JSDoc en rutas y las escaneamos
  };

  const spec = swaggerJsdoc(options);

  app.get("/docs.json", (_req: Request, res: Response) => res.status(200).json(spec)); // útil para verificar
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, {
    explorer: true,
    swaggerOptions: { persistAuthorization: true },
  }));

  console.log("[products] Swagger montado en /docs");
}
