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
      OrderItem: {
        type: "object",
        properties: {
          productId: { type: "string", example: "a6cae558-f19f-4678-ac85-ad689aad3de9" },
          name: { type: "string", example: "Café orgánico" },
          price: { type: "number", example: 15000 },
          quantity: { type: "integer", example: 1 },
        },
        required: ["productId", "name", "price", "quantity"],
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", example: "f7c8a8d2-9ac0-4f78-8df1-3b0c3f6a8a77" },
          status: { type: "string", enum: ["PENDING", "PAID", "CANCELLED"], example: "PENDING" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          total: { type: "number", example: 15000 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "status", "items", "total"],
      },
      CreateOrderRequest: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
        required: ["items"],
      },
      UpdateStatusRequest: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["PENDING", "PAID", "CANCELLED"] },
        },
        required: ["status"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/orders": {
      get: {
        summary: "Obtener todas las órdenes",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de órdenes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          401: { description: "No autorizado" },
        },
      },
      post: {
        summary: "Crear una nueva orden",
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
          400: { description: "Error en la petición" },
          401: { description: "No autorizado" },
        },
      },
    },
    "/orders/{id}": {
      get: {
        summary: "Obtener una orden por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Orden encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          404: { description: "No encontrada" },
          401: { description: "No autorizado" },
        },
      },
      delete: {
        summary: "Eliminar una orden por ID",
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
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UpdateStatusRequest" } },
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
          400: { description: "Error en la petición" },
          404: { description: "No encontrada" },
          401: { description: "No autorizado" },
        },
      },
    },
  },
};
