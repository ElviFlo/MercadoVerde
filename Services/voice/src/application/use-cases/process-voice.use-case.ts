import { SpeechService } from '../../infrastructure/services/speech.service';

export class ProcessVoiceUseCase {
  private service = new SpeechService();

  async execute(dto: { transcript: string; confidence?: number; source?: string }) {
    return this.service.handleTranscript(dto.transcript, dto.confidence ?? 1, dto.source);
  }
}
