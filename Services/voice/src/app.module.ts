import { Module } from '@nestjs/common';
import { VoiceController } from './infrastructure/controllers/voice.controller';
import { ProcessVoiceUseCase } from './application/use-cases/process-voice.use-case';

@Module({
  imports: [],
  controllers: [VoiceController],
  providers: [ProcessVoiceUseCase],
})
export class AppModule {}
