import { Controller, Post, Body } from '@nestjs/common';
import { SpeechService } from '../services/speech.service';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('listen')
  listen(@Body() body: { transcript: string; language: string }) {
    return this.speechService.processCommand(body.transcript, body.language);
  }

  @Post('health')
  health() {
    return { ok: true };
  }
}
