// Services/orders/src/infrastructure/swagger/order.definition.ts

export const orderSwagger = {
  openapi: "3.0.0",
  info: {
    title: "Orders Service API",
    version: "1.0.0",
    description: "API para gestionar órdenes con validación JWT",
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Customer: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", example: "Ricardo Pérez" },
          email: { type: "string", format: "email", example: "ricardo@example.com" },
        },
      },
      OrderItem: {
        type: "object",
        required: ["productId", "name", "price", "quantity"],
        properties: {
          productId: {
            type: "string",
            example: "a6cae558-f19f-4678-ac85-ad689aad3de9",
            description: "ID del producto (proveniente del microservicio de products)",
          },
          name: { type: "string", example: "Café orgánico" },
          price: { type: "number", example: 15000 },
          quantity: { type: "integer", example: 1, minimum: 1 },
        },
      },
      Order: {
        type: "object",
        required: ["id", "status", "customer", "items", "total"],
        properties: {
          id: { type: "string", example: "f7c8a8d2-9ac0-4f78-8df1-3b0c3f6a8a77" },
          status: {
            type: "string",
            enum: ["PENDING", "PAID", "CANCELLED"],
            example: "PENDING",
          },
          customer: { $ref: "#/components/schemas/Customer" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          total: { type: "number", example: 15000 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateOrderRequest: {
        type: "object",
        required: ["customer", "items"],
        properties: {
          customer: { $ref: "#/components/schemas/Customer" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
            minItems: 1,
          },
        },
        example: {
          customer: { name: "Ricardo Pérez", email: "ricardo@example.com" },
          items: [
            {
              productId: "a6cae558-f19f-4678-ac85-ad689aad3de9",
              name: "Café orgánico",
              price: 15000,
              quantity: 1,
            },
          ],
        },
      },
      UpdateStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["PENDING", "PAID", "CANCELLED"] },
        },
        example: { status: "PAID" },
      },
      ErrorResponse: {
        type: "object",
        properties: { message: { type: "string" } },
        example: { message: "customer name and email are required" },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/orders": {
      get: {
        summary: "Obtener todas las órdenes",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de órdenes",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Order" } },
              },
            },
          },
          401: { description: "No autorizado" },
        },
      },
      post: {
        summary: "Crear una nueva orden",
        tags: ["Orders"],
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
          201: {
            description: "Orden creada exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          400: {
            description: "Error en la petición",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: { description: "No autorizado" },
        },
      },
    },
    "/orders/{id}": {
      get: {
        summary: "Obtener una orden por ID",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Orden encontrada",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Order" } },
            },
          },
          404: { description: "No encontrada" },
          401: { description: "No autorizado" },
        },
      },
      delete: {
        summary: "Eliminar una orden por ID",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          204: { description: "Eliminada" },
          404: { description: "No encontrada" },
          401: { description: "No autorizado" },
        },
      },
    },
    "/orders/{id}/status": {
      put: {
        summary: "Actualizar estado de una orden",
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateStatusRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Estado actualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          400: {
            description: "Error en la petición",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: { description: "No encontrada" },
          401: { description: "No autorizado" },
        },
      },
    },
  },
};
