// src/openai.client.ts
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "[openai.client] ⚠️ Falta OPENAI_API_KEY en las variables de entorno"
  );
}

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
