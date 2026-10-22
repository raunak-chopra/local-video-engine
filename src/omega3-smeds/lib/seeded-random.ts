/**
 * Seeded PRNG (mulberry32) — deterministic, no Math.random() during render.
 */
export function makeSeededRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pre-generate an array of N random values from a seeded RNG.
 */
export function seededArray(seed: number, count: number): number[] {
  const rng = makeSeededRng(seed);
  return Array.from({length: count}, rng);
}
