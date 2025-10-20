// src/infrastructure/swagger/auth.swagger.ts
import type { Application, Request, Response } from "express";
import * as swaggerUi from "swagger-ui-express";
// CommonJS require para evitar default import issues
const swaggerJsdoc: (
  opts: import("swagger-jsdoc").Options,
) => any = require("swagger-jsdoc");

export function setupSwagger(app: Application) {
  try {
    const PORT = process.env.PORT ?? "3001";
    const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

    const options: import("swagger-jsdoc").Options = {
      definition: {
        openapi: "3.0.3",
        info: {
          title: "MercadoVerde - Auth API",
          version: "1.0.0",
          description:
            "Servicio de autenticación con separación de vistas por **admin** (creado automáticamente al arrancar) y **client** (registrados por formulario).",
        },
        servers: [{ url: `${HOST}:${PORT}` }],
        components: {
          securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
          },
          schemas: {
            RegisterRequest: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", example: "Ricardo Pérez" },
                email: { type: "string", example: "ricardo@example.com" },
                password: { type: "string", example: "123456" },
              },
            },
            // Login por email O por name (ejemplos por defecto → CLIENTE)
            LoginRequest: {
              oneOf: [
                {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "client@example.com" }, // ← ejemplo cliente
                    password: { type: "string", example: "123456" },
                  },
                },
                {
                  type: "object",
                  required: ["name", "password"],
                  properties: {
                    name: { type: "string", example: "clientuser" }, // ← ejemplo cliente
                    password: { type: "string", example: "123456" },
                  },
                },
              ],
            },
            AccessTokenResponse: {
              type: "object",
              properties: {
                role: { type: "string", enum: ["admin", "client"] },
                accessToken: { type: "string", example: "eyJhbGciOi..." },
              },
            },
            MessageResponse: {
              type: "object",
              properties: { message: { type: "string" } },
            },
            ValidateResponse: {
              type: "object",
              properties: {
                valid: { type: "boolean", example: true },
                payload: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    sub: "user-id-123",
                    email: "client@example.com",
                    role: "client",
                    iss: "mercadoverde-auth",
                    iat: 1712345678,
                    exp: 1712349278,
                  },
                },
              },
            },
            MeResponse: {
              type: "object",
              properties: {
                message: { type: "string", example: "OK client" },
                user: {
                  type: "object",
                  additionalProperties: true,
                  example: {
                    sub: "user-id-123",
                    email: "client@example.com",
                    role: "client",
                    iss: "mercadoverde-auth",
                  },
                },
              },
            },
          },
        },
        tags: [
          { name: "Auth", description: "Registro y login" },
          { name: "Validate", description: "Validación de tokens" },
          { name: "Me", description: "Rutas protegidas de prueba" },
        ],
        paths: {
          "/auth/register": {
            post: {
              tags: ["Auth"],
              summary: "Registrar usuario (siempre como client)",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RegisterRequest" },
                  },
                },
              },
              responses: {
                "201": {
                  description: "Usuario registrado",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/MessageResponse" },
                    },
                  },
                },
                "400": { description: "Solicitud inválida" },
              },
            },
          },

          "/auth/login/admin": {
            post: {
              tags: ["Auth"],
              summary: "Login del admin único (creado en bootstrap)",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginRequest" },
                    // 👇 Ejemplos específicos para ADMIN
                    examples: {
                      byEmail: {
                        summary: "Admin por email",
                        value: { email: "super@admin.com", password: "P4ssw0rd!" },
                      },
                      byName: {
                        summary: "Admin por name",
                        value: { name: "superadmin", password: "P4ssw0rd!" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Token de acceso para admin",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AccessTokenResponse" },
                    },
                  },
                },
                "401": { description: "Credenciales inválidas" },
              },
            },
          },

          "/auth/login/client": {
            post: {
              tags: ["Auth"],
              summary: "Login de cliente (usuarios registrados)",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginRequest" },
                    // 👇 Ejemplos específicos para CLIENTE
                    examples: {
                      byEmail: {
                        summary: "Cliente por email",
                        value: { email: "client@example.com", password: "123456" },
                      },
                      byName: {
                        summary: "Cliente por name",
                        value: { name: "clientuser", password: "123456" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Token de acceso para cliente",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AccessTokenResponse" },
                    },
                  },
                },
                "401": { description: "Credenciales inválidas" },
              },
            },
          },

          "/auth/login": {
            post: {
              tags: ["Auth"],
              summary: "Login genérico (compatibilidad: emite token de cliente)",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginRequest" },
                    // 👇 También ejemplos de cliente (nunca admin)
                    examples: {
                      byEmail: {
                        summary: "Cliente por email",
                        value: { email: "client@example.com", password: "123456" },
                      },
                      byName: {
                        summary: "Cliente por name",
                        value: { name: "clientuser", password: "123456" },
                      },
                    },
                  },
                },
              },
              responses: {
                "200": {
                  description: "Token de acceso (cliente)",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/AccessTokenResponse" },
                    },
                  },
                },
                "401": { description: "Credenciales inválidas" },
              },
            },
          },

          "/auth/validate": {
            get: {
              tags: ["Validate"],
              summary: "Validar token (cualquier rol)",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "Token válido",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/ValidateResponse" },
                    },
                  },
                },
                "401": { description: "Token inválido o ausente" },
              },
            },
          },

          "/auth/me/admin": {
            get: {
              tags: ["Me"],
              summary: "Ruta protegida – solo admin",
              description: "Requiere token con `role=admin` y `iss=JWT_ISS`.",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "OK admin",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/MeResponse" },
                    },
                  },
                },
                "401": { description: "No autenticado" },
                "403": { description: "Prohibido (no admin)" },
              },
            },
          },

          "/auth/me/client": {
            get: {
              tags: ["Me"],
              summary: "Ruta protegida – solo client",
              description: "Requiere token con `role=client` y `aud=JWT_AUD`.",
              security: [{ bearerAuth: [] }],
              responses: {
                "200": {
                  description: "OK client",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/MeResponse" },
                    },
                  },
                },
                "401": { description: "No autenticado" },
                "403": { description: "Prohibido (no client)" },
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
  } catch (err) {
    console.error("[auth] Error montando Swagger:", err);
  }
}
