"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
var swaggerUi = require("swagger-ui-express");
// CommonJS require para evitar issues con default import
var swaggerJsdoc = require("swagger-jsdoc");
function setupSwagger(app) {
    var _a, _b;
    var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3003";
    var HOST = (_b = process.env.SWAGGER_HOST) !== null && _b !== void 0 ? _b : "http://localhost";
    var idParam = {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", example: "h4lqwzif6u" }, // ← string
        description: "ID del producto (string, ej. cuid/uuid)",
    };
    var options = {
        definition: {
            openapi: "3.0.3",
            info: {
                title: "MercadoVerde - Products API",
                version: "1.0.0",
                description: "Lectura disponible para **client** y **admin** (token requerido). Mutaciones (create/update/delete) **solo admin**. Los tokens deben ser emitidos por `auth/` con el **mismo** `JWT_SECRET`/`JWT_ISS`/`JWT_AUD`.",
            },
            servers: [{ url: "".concat(HOST, ":").concat(PORT) }],
            components: {
                securitySchemes: {
                    bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
                },
                schemas: {
                    Product: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "h4lqwzif6u" }, // ← string
                            name: { type: "string", example: "Café orgánico" },
                            price: { type: "number", example: 19.99 },
                            stock: { type: "integer", example: 50 },
                            description: { type: "string", nullable: true, example: "Tueste medio, 500g" },
                            categoryId: { type: "string", nullable: true, example: "cat_abc123" },
                            createdBy: { type: "string", example: "super@admin.com" },
                            active: { type: "boolean", example: true },
                            createdAt: { type: "string", format: "date-time", example: "2025-09-29T21:20:00.000Z" },
                            updatedAt: { type: "string", format: "date-time", example: "2025-09-29T21:20:00.000Z" },
                        },
                    },
                    CreateProductRequest: {
                        type: "object",
                        required: ["name", "price", "stock"],
                        properties: {
                            name: { type: "string", example: "Café orgánico" },
                            price: { type: "number", example: 19.99 },
                            stock: { type: "integer", example: 50 },
                            description: { type: "string", example: "Tueste medio, 500g" },
                            categoryId: { type: "string", nullable: true, example: "cat_abc123" },
                            active: { type: "boolean", example: true },
                        },
                    },
                    UpdateProductRequest: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            price: { type: "number" },
                            stock: { type: "integer" },
                            description: { type: "string" },
                            categoryId: { type: "string", nullable: true },
                            active: { type: "boolean" },
                        },
                    },
                    MessageResponse: {
                        type: "object",
                        properties: { message: { type: "string" } },
                    },
                },
            },
            tags: [
                { name: "Products - Client", description: "Lectura (requiere client o admin autenticado)" },
                { name: "Products - Admin", description: "Mutaciones (solo admin)" },
            ],
            paths: {
                "/products": {
                    get: {
                        tags: ["Products - Client"],
                        summary: "Listar productos",
                        description: "Requiere token válido. Acepta **client** (aud=JWT_AUD) o **admin** (iss=JWT_ISS).",
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
                                content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } },
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
                        parameters: [idParam], // ← string
                        responses: {
                            "200": {
                                description: "OK",
                                content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } },
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
                        parameters: [idParam], // ← string
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
                                content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } },
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
                        parameters: [idParam], // ← string
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
    var spec = swaggerJsdoc(options);
    app.get("/docs.json", function (_req, res) { return res.json(spec); });
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, {
        explorer: true,
        swaggerOptions: { persistAuthorization: true },
    }));
}
