// src/utils/wordsToNumber.ts
const map: Record<string, number> = {
  cero: 0,
  uno: 1,
  una: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
};

export function wordsToNumber(word: string): number {
  const normalized = word.toLowerCase().trim();

  if (normalized in map) return map[normalized];

  const parsed = parseInt(normalized, 10);
  if (!isNaN(parsed)) return parsed;

  return 1; // por defecto, si no reconoce la palabra, asume 1
}
