// src/infrastructure/swagger/auth.swagger.ts
export const authSwagger = {
  openapi: "3.0.3",
  info: {
    title: "MercadoVerde - Auth Service",
    version: "1.0.0",
    description:
      "API de autenticación con registro, login con JWT, validación de token, perfil protegido y refresh opcional."
  },
  servers: [
    { url: "http://localhost:3001", description: "Local" }
  ],
  tags: [
    { name: "Auth", description: "Endpoints de autenticación" },
    { name: "Health", description: "Salud del servicio" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", example: "ricardo" },
          email: { type: "string", format: "email", example: "ricardo@example.com" },
          password: { type: "string", format: "password", example: "123456" }
        }
      },
      RegisterResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Usuario registrado" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "ricardo" },
          password: { type: "string", format: "password", example: "123456" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOi..." }
        }
      },
      RefreshRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOi...refresh..." }
        }
      },
      RefreshResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOi...new..." }
        }
      },
      MeResponse: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "a1b2c3" },
              username: { type: "string", example: "ricardo" },
              email: { type: "string", format: "email", example: "ricardo@example.com" },
              role: { type: "string", example: "user" }
            }
          }
        }
      },
      ValidateResponse: {
        type: "object",
        properties: {
          valid: { type: "boolean", example: true },
          payload: { type: "object", additionalProperties: true }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Mensaje de error" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Healthcheck del servicio",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "object", properties: { ok: { type: "boolean", example: true } } }
              }
            }
          }
        }
      }
    },

    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar nuevo usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } }
          }
        },
        responses: {
          "201": {
            description: "Usuario creado",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/RegisterResponse" } }
            }
          },
          "400": {
            description: "Error de validación o usuario existente",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login (devuelve accessToken)",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } }
            }
          },
          "401": {
            description: "Credenciales inválidas",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },

    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refrescar accessToken (opcional, si implementas refresh tokens)",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefreshRequest" } }
          }
        },
        responses: {
          "200": {
            description: "Nuevo accessToken",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/RefreshResponse" } }
            }
          },
          "401": {
            description: "Refresh token inválido o expirado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Perfil del usuario (protegido)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: "#/components/schemas/MeResponse" } } }
          },
          "401": {
            description: "No autorizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },

    "/auth/validate": {
      get: {
        tags: ["Auth"],
        summary: "Validar un Bearer token (protegido)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Token válido",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ValidateResponse" } } }
          },
          "401": {
            description: "Token inválido o expirado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    }
  }
} as const;
