export function fuzzyMatch(input: string, target: string): number {
  let distance = 0;
  for (let i = 0; i < Math.min(input.length, target.length); i++) {
    if (input[i] !== target[i]) distance++;
  }
  return 1 - distance / Math.max(input.length, target.length);
}
