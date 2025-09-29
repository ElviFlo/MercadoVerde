export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")                     // elimina acentos
    .replace(/[\u0300-\u036f]/g, "")      // quita diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")          // reemplaza todo lo raro por guiones
    .replace(/^-+|-+$/g, "");             // limpia guiones sobrantes
}
