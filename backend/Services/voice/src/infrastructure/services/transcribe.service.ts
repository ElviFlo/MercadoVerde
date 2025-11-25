// src/services/transcribe.service.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { openaiClient } from "./openai.client";

/**
 * Recibe un Buffer de audio (wav/mp3/webm) y devuelve el texto transcrito.
 * Usa Whisper (modelo "whisper-1").
 */
export async function transcribeAudioFromBuffer(
  buffer: Buffer,
  originalName = "audio.webm"
): Promise<string> {
  // Sacamos la extensión del archivo original, si viene
  const ext = path.extname(originalName) || ".webm";

  // Ruta de archivo temporal en /tmp
  const tmpPath = path.join(os.tmpdir(), `kora-voice-${randomUUID()}${ext}`);

  // 1) Guardamos el buffer en disco
  await fs.promises.writeFile(tmpPath, buffer);

  try {
    // 2) Creamos un ReadStream (tipo FsReadStream → lo que pide el SDK)
    const fileStream = fs.createReadStream(tmpPath);

    const response = await openaiClient.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      // Fuerza español (opcional)
      language: "es",
    });

    return response.text ?? "";
  } finally {
    // 3) Borramos el archivo temporal (best-effort)
    fs.promises.unlink(tmpPath).catch(() => {});
  }
}
