import type { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export function setupSwagger(app: Application) {
  try {
    const PORT = process.env.PORT ?? "3001";
    const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

    const options: swaggerJsdoc.Options = {
      definition: {
        openapi: "3.0.3",
        info: {
          title: "MercadoVerde - Auth API",
          version: "1.0.0",
          description: "Endpoints de autenticación (register, login).",
        },
        servers: [{ url: `${HOST}:${PORT}` }],
        components: {
          securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
          },
          schemas: {
            LoginRequest: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "ricardo" },
                password: { type: "string", example: "123456" },
              },
            },
            LoginResponse: {
              type: "object",
              properties: {
                access_token: { type: "string", example: "eyJhbGciOi..." },
                token_type: { type: "string", example: "Bearer" },
                expires_in: { type: "string", example: "15m" },
              },
            },
            RegisterRequest: {
              type: "object",
              required: ["username", "password", "email"],
              properties: {
                username: { type: "string", example: "ricardo" },
                password: { type: "string", example: "123456" },
                email: { type: "string", example: "ricardo@example.com" },
              },
            },
          },
        },
        paths: {
          "/auth/register": {
            post: {
              tags: ["Auth"],
              summary: "Registrar usuario",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/RegisterRequest" },
                  },
                },
              },
              responses: {
                "200": { description: "Usuario registrado" },
                "400": { description: "Solicitud inválida" },
              },
            },
          },
          "/auth/login": {
            post: {
              tags: ["Auth"],
              summary: "Login (obtén access_token)",
              requestBody: {
                required: true,
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/LoginRequest" },
                  },
                },
              },
              responses: {
                "200": {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/LoginResponse" },
                    },
                  },
                },
                "401": { description: "Credenciales inválidas" },
              },
            },
          },
        },
      },
      // Si luego quieres leer anotaciones JSDoc de tus rutas, agrega patrones aquí:
      // apis: ["src/infrastructure/routes/*.ts"],
      apis: [],
    };

    const spec = swaggerJsdoc(options);

    // Endpoint para ver el JSON del spec (útil para diagnosticar 52 Empty reply)
    app.get("/docs.json", (_req: Request, res: Response) => res.json(spec));

    // UI con auth persistente
    app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(spec, {
        explorer: true,
        swaggerOptions: { persistAuthorization: true },
      })
    );

    console.log("[auth] Swagger montado en /docs");
  } catch (err) {
    console.error("[auth] Error montando Swagger:", err);
  }
}
