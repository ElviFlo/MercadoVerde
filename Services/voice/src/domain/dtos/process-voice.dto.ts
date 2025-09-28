export class ProcessVoiceDto {
  transcript: string;
  confidence?: number; // 0..1
  source?: 'mic' | 'file';
}
