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
        '- Aplica tanto para usuarios con rol **client** como **admin** autenticados.\n' +
        '- Usa el `sub` del JWT emitido por el servicio de Auth para identificar al dueño del carrito.\n' +
        '- Permite obtener el carrito actual, agregar productos, eliminar un producto específico o vaciar el carrito.',
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
    .addTag(
      'Cart',
      'Operaciones sobre el carrito del usuario autenticado (client o admin). ' +
        'Todas las operaciones usan el usuario del token JWT.',
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
