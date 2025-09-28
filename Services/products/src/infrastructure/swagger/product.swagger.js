"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSwagger = void 0;
exports.productSwagger = {
    openapi: "3.0.0",
    info: {
        title: "Products Service API",
        version: "1.0.0",
        description: "API para gestionar productos"
    },
    servers: [
        { url: "http://localhost:3003", description: "Local" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    paths: {
        "/products": {
            get: {
                summary: "Listar productos",
                tags: ["Products"],
                responses: { "200": { description: "Lista de productos" } }
            },
            post: {
                summary: "Crear producto",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    price: { type: "number" },
                                    stock: { type: "integer" }
                                },
                                required: ["name", "price"]
                            },
                            example: {
                                name: "Café orgánico",
                                description: "Bolsa 250g",
                                price: 12.5,
                                stock: 100
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Producto creado" },
                    "401": { description: "No autorizado" }
                }
            }
        },
        "/products/{id}": {
            get: {
                summary: "Obtener producto por id",
                tags: ["Products"],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { "200": { description: "Producto" }, "404": { description: "No encontrado" } }
            },
            put: {
                summary: "Actualizar producto",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: { type: "object" },
                            example: { name: "Café Premium", price: 14.0 }
                        }
                    }
                },
                responses: { "200": { description: "Producto actualizado" }, "401": { description: "No autorizado" } }
            },
            delete: {
                summary: "Eliminar producto",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { "204": { description: "Eliminado" }, "401": { description: "No autorizado" } }
            }
        }
    },
    tags: [{ name: "Products", description: "Operaciones sobre productos" }]
};
