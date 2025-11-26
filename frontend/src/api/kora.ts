// src/api/kora.ts
export type KoraResponse = {
  message: string;
  product?: any;
  cart?: any;
};

const VOICE_BASE_URL =
  import.meta.env.VITE_VOICE_URL ?? "http://localhost:3006";

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("You must be logged in to use Kora.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function sendVoiceCommand(audio: Blob): Promise<KoraResponse> {
  const formData = new FormData();
  // 👈 el campo DEBE llamarse "audio" (multer.single("audio"))
  formData.append("audio", audio, "kora-command.webm");

  const res = await fetch(`${VOICE_BASE_URL}/api/kora/voice`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      // NO pongas Content-Type, el navegador lo pone con boundary
    },
    body: formData,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // por si el backend devuelve algo raro
    data = null;
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Error processing voice command (status ${res.status})`;
    throw new Error(msg);
  }

  return data as KoraResponse;
}

// (Opcional) si luego quieres texto:
// export async function sendTextCommand(text: string): Promise<KoraResponse> { ... }
