"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
var swaggerUi = require("swagger-ui-express");
// usa require con any para evitar tipos
// eslint-disable-next-line @typescript-eslint/no-var-requires
var swaggerJsdoc = require("swagger-jsdoc");
function setupSwagger(app) {
    var _a, _b;
    var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3002";
    var HOST = (_b = process.env.SWAGGER_HOST) !== null && _b !== void 0 ? _b : "http://localhost";
    var options = {
        definition: {
            openapi: "3.0.3",
            info: {
                title: "MercadoVerde - Orders API",
                version: "1.0.0",
                description: "Crear/listar propias: **client**. Ver todas: **admin**. Detalle: **admin o dueño**.",
            },
            servers: [{ url: "".concat(HOST, ":").concat(PORT) }],
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
                        summary: "Crear orden",
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
                        summary: "Listar todas",
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
                        summary: "Listar mis órdenes",
                        responses: {
                            "200": { description: "OK" },
                            "401": { description: "No autenticado" },
                            "403": { description: "Requiere rol client" },
                        },
                    },
                },
                "/orders/mine/{id}": {
                    get: {
                        tags: ["Orders - Client"],
                        security: [{ bearerAuth: [] }],
                        summary: "Detalle de mi orden",
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
                "/orders/{id}": {
                    get: {
                        tags: ["Orders - Admin"],
                        security: [{ bearerAuth: [] }],
                        summary: "Detalle orden (admin)",
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
    var spec = swaggerJsdoc(options);
    app.get("/docs.json", function (_req, res) { return res.json(spec); });
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec, {
        explorer: true,
        swaggerOptions: { persistAuthorization: true },
    }));
}
