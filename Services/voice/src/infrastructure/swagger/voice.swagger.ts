import type { Application } from "express";
import * as swaggerUi from "swagger-ui-express";
const swaggerJsdoc = require("swagger-jsdoc");

/**
 * @swagger
 * /api/kora/command:
 *   post:
 *     summary: Procesa un comando de voz o texto para agregar productos al carrito.
 *     tags: [Voice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Agrega dos cafés molidos"
 *     responses:
 *       200:
 *         description: Comando procesado correctamente.
 *       400:
 *         description: Error en el comando recibido.
 */
export function setupSwagger(app: Application) {
  const PORT = process.env.PORT ?? "3002";
  const HOST = process.env.SWAGGER_HOST ?? "http://localhost";

  const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "MercadoVerde - Voice API",
        version: "1.0.0",
        description:
          "Servicio de voz (Kora) para agregar productos al carrito mediante comandos de texto/voz.",
      },
      servers: [{ url: `${HOST}:${PORT}` }],

      // 🔐 --- AGREGADO AQUÍ ---
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      // -------------------------
    },

    apis: [__filename], // Aquí lee las anotaciones @swagger
  };

  const specs = swaggerJsdoc(options);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}
