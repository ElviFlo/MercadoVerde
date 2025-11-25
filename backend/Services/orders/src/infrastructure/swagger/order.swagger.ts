// src/infrastructure/swagger/order.swagger.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

export function setupSwagger(app: Express) {
  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "MercadoVerde - Orders API",
      version: "1.0.0",
      description:
        "Crear y listar órdenes. Cliente: crea y ve sus órdenes. Admin: lista todas las órdenes.",
    },
    servers: [
      {
        url: "http://localhost:3002",
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
      schemas: {
        CreateOrderRequest: {
          type: "object",
          properties: {
            cartId: {
              type: "string",
              example: "cuid_cart_123",
            },
          },
          required: ["cartId"],
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            nameSnapshot: { type: "string" },
            unitPrice: { type: "number", format: "double" },
            quantity: { type: "integer" },
            subtotal: { type: "number", format: "double" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            cartId: { type: "string" },
            userId: { type: "string" },
            userName: { type: "string" },
            status: { type: "string", example: "PAID" },
            total: { type: "number", format: "double" },
            totalItems: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Orders - Client",
        description: "Acciones de cliente",
      },
      {
        name: "Orders - Admin",
        description: "Acciones administrativas",
      },
    ],
    paths: {
      "/orders": {
        post: {
          tags: ["Orders - Client"],
          summary: "Crear orden",
          description:
            "Crea una orden a partir de un carrito existente del usuario autenticado.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateOrderRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Orden creada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Order" },
                },
              },
            },
            "400": { description: "cartId requerido o inválido" },
            "401": { description: "No autenticado" },
            "500": { description: "Error creando la orden" },
          },
        },
        get: {
          tags: ["Orders - Admin"],
          summary: "Listar todas las órdenes",
          description: "Lista todas las órdenes. Solo admin.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Listado de órdenes",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
            "401": { description: "No autenticado" },
            "403": { description: "No autorizado (se requiere admin)" },
          },
        },
      },
      "/orders/mine": {
        get: {
          tags: ["Orders - Client"],
          summary: "Listar mis órdenes",
          description: "Lista todas las órdenes del usuario autenticado.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Listado de órdenes propias",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
            "401": { description: "No autenticado" },
          },
        },
      },
    },
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}
