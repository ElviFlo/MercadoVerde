import { Module } from '@nestjs/common';
import { VoiceController } from './infrastructure/controllers/voice.controller';

@Module({
  imports: [],
  controllers: [VoiceController],
  providers: [],
})
export class AppModule {}
