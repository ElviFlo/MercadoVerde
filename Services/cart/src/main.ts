import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('MercadoVerde - Cart API')
    .setDescription(
      'Microservicio de carrito de compras.\n\n' +
        '- Todos los endpoints usan el usuario autenticado a partir del token JWT (claim `sub`).\n' +
        '- Permite obtener el carrito actual, agregar productos, remover productos específicos y vaciar el carrito.\n' +
        '- Requiere un token emitido por el servicio de Auth en el header `Authorization: Bearer <token>`.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT emitido por el microservicio de Auth',
      },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // /health simple
  app.getHttpAdapter()
    .get('/health', (_req, res) =>
      res.json({
        ok: true,
        service: 'cart',
        timestamp: new Date().toISOString(),
      }),
    );

  // /docs.json crudo
  app.getHttpAdapter()
    .get('/docs.json', (_req, res) => res.json(document));

  const port = Number(process.env.PORT ?? 3005);
  await app.listen(port);
  console.log(
    `🟢 Cart service running on http://localhost:${port}/docs (Swagger UI)`,
  );
}
bootstrap();
