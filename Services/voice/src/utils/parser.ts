// Services/voice/src/utils/parser.ts
export function parseVoiceCommand(transcript: string): { productName?: string; quantity?: number } {
  const match = transcript.match(/(\d+)\s*(?:de|x)?\s*(\w+)/i);
  if (!match) return {};
  return { quantity: parseInt(match[1]), productName: match[2] };
}
