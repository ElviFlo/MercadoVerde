import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS (útil para dev y gateway)
  app.enableCors({
    origin: true, // en prod puedes restringirlo
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('MercadoVerde - Categories API')
    .setDescription('CRUD de categorías protegido con JWT')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Exponer JSON crudo como en products
  app.getHttpAdapter().get('/docs.json', (req, res) => res.json(document));

  // Puerto (orders usa 3002; products 3003; categories -> 3004)
  const port = Number(process.env.PORT ?? 3004);
  await app.listen(port);
  console.log(`🟢 Categories service running on http://localhost:${port}/docs/ with Swagger`);
}

bootstrap();
