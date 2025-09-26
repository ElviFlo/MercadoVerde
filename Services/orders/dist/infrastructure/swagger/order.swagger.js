"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSwagger = void 0;
exports.orderSwagger = {
    openapi: "3.0.0",
    info: {
        title: "Orders Service API",
        version: "1.0.0",
        description: "API para gestionar órdenes con validación JWT",
    },
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
        "/orders": {
            get: {
                summary: "Obtener todas las órdenes",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "Lista de órdenes",
                    },
                    401: {
                        description: "No autorizado",
                    },
                },
            },
            post: {
                summary: "Crear una nueva orden",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product: { type: "string" },
                                    quantity: { type: "integer" },
                                    price: { type: "number" },
                                },
                                required: ["product", "quantity", "price"],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Orden creada exitosamente",
                    },
                    400: {
                        description: "Error en la petición",
                    },
                    401: {
                        description: "No autorizado",
                    },
                },
            },
        },
    },
};
