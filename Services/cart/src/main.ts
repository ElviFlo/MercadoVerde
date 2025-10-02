import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Cart Service')
    .setDescription('API para carrito de compras (JWT Bearer)')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // /health simple
  app.getHttpAdapter().get('/health', (req, res) => res.json({ ok: true, service: 'cart', timestamp: new Date().toISOString() }));

  // opcional: /docs.json crudo
  app.getHttpAdapter().get('/docs.json', (req, res) => res.json(document));

  const port = Number(process.env.PORT ?? 3005);
  await app.listen(port);
  console.log(`🟢 Cart service running on http://localhost:${port}/docs with Swagger`);
}
bootstrap();
