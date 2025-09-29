import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { SpeechController } from './infrastructure/controllers/speech.controller';
import { SpeechService } from './infrastructure/services/speech.service';
import { prisma } from './infrastructure/db';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  controllers: [SpeechController],
  providers: [
    SpeechService,
    { provide: 'PRISMA', useValue: prisma },
  ],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Voice Service')
    .setDescription('Microservicio de voz Kora')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3005);
  console.log('Voice service listening on 3005');
  console.log('Swagger UI available at http://localhost:3005/api');
}
bootstrap();
