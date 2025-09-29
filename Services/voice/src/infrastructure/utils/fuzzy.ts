export function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const as = new Set(a.split(/\s+/));
  const bs = new Set(b.split(/\s+/));
  const inter = [...as].filter(x => bs.has(x)).length;
  const union = new Set([...as, ...bs]).size;
  if (union === 0) return 0;
  return inter / union;
}
