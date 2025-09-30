import type { Application, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3006";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "MercadoVerde - Voice Service (Kora)",
        version: "1.0.0",
        description:
          "Servicio de voz que conecta comandos de usuario con el carrito de compras. Convierte voz → texto → acción.",
      },
      servers: [{ url: `${HOST}:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          AddToCartRequest: {
            type: "object",
            required: ["productId", "quantity"],
            properties: {
              productId: { type: "string", example: "p_123" },
              quantity: { type: "integer", example: 2 },
              inputText: {
                type: "string",
                example: "Agrega dos cafés al carrito",
              },
            },
          },
          AddToCartResponse: {
            type: "object",
            properties: {
              ok: { type: "boolean", example: true },
              message: { type: "string", example: "Producto agregado al carrito" },
              userId: { type: "string", example: "u_1" },
            },
          },
        },
      },
      paths: {
        "/voice/add-to-cart": {
          post: {
            tags: ["Voice"],
            summary: "Agrega un producto al carrito (usando JWT)",
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AddToCartRequest" },
                },
              },
            },
            responses: {
              "200": {
                description: "Producto agregado",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/AddToCartResponse" },
                  },
                },
              },
              "401": { description: "Token requerido" },
              "500": { description: "Error en Voice Service" },
            },
          },
        },
      },
      tags: [{ name: "Voice" }],
    },
    apis: [],
  };

  const spec = swaggerJsdoc(options);

  app.get("/docs.json", (_req: Request, res: Response) =>
    res.status(200).json(spec)
  );
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      explorer: true,
      swaggerOptions: { persistAuthorization: true },
    })
  );

  console.log("[voice] Swagger montado en /docs");
}
