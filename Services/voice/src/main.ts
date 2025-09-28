import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger (opcional, útil para probar)
  const config = new DocumentBuilder()
    .setTitle('Voice Service (Kora)')
    .setDescription('Endpoints para procesamiento de voz')
    .setVersion('0.1')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, doc);

  // puerto desde ENV o default 3005
  const port = process.env.PORT ? Number(process.env.PORT) : 3005;
  const prefix = process.env.GLOBAL_PREFIX ?? 'api';
  app.setGlobalPrefix(prefix);

  await app.listen(port);
  console.log(`Voice service listening on ${port} (prefix: /${prefix})`);
}
bootstrap();
