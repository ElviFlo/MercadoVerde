import { Controller, Post, Body } from '@nestjs/common';
import { ProcessVoiceDto } from '../../domain/dtos/process-voice.dto';
import { ProcessVoiceUseCase } from '../../application/use-cases/process-voice.use-case';

@Controller('voice')
export class VoiceController {
  private useCase = new ProcessVoiceUseCase();

  @Post('process')
  async process(@Body() body: ProcessVoiceDto) {
    return this.useCase.execute(body);
  }
}
