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
          },
        },
        tags: [
          { name: "Auth", description: "Registro y login" },
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
