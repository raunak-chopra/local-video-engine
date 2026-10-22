/**
 * Deterministic per-particle positional curves.
 * All values derived from seed data + current frame — no runtime physics.
 */

export type ParticleData = {
  /** Normalised [0,1] initial x position within the chamber */
  x0: number;
  /** Normalised [0,1] initial y position within the chamber */
  y0: number;
  /** Drift angle in radians */
  angle: number;
  /** Drift speed multiplier (0.6–1.4) */
  speed: number;
  /** Initial scale (0.7–1.3) */
  scale: number;
  /** Oscillation phase offset */
  phase: number;
  /** Opacity variation seed */
  opacitySeed: number;
};

/**
 * Build an array of ParticleData from pre-seeded random values.
 * Expects a flat array whose length is at least count*7.
 */
export function buildParticles(rands: number[], count: number): ParticleData[] {
  return Array.from({length: count}, (_, i) => ({
    x0: rands[i * 7 + 0] ?? 0.5,
    y0: rands[i * 7 + 1] ?? 0.5,
    angle: (rands[i * 7 + 2] ?? 0.5) * Math.PI * 2,
    speed: 0.6 + (rands[i * 7 + 3] ?? 0.5) * 0.8,
    scale: 0.7 + (rands[i * 7 + 4] ?? 0.5) * 0.6,
    phase: (rands[i * 7 + 5] ?? 0.5) * Math.PI * 2,
    opacitySeed: rands[i * 7 + 6] ?? 0.5,
  }));
}

/**
 * Evaluate a large-droplet position.
 * Returns {x, y} in normalised [0,1] space.
 */
export function largeDropletPos(
  p: ParticleData,
  progress: number, // 0→1 across the shot
): {x: number; y: number} {
  const drift = progress * 0.18 * p.speed;
  const wobble = Math.sin(progress * Math.PI * 3 + p.phase) * 0.018;
  return {
    x: p.x0 + Math.cos(p.angle) * drift + wobble,
    y: p.y0 + Math.sin(p.angle) * drift,
  };
}

/**
 * Evaluate a micro-droplet position.
 * Returns {x, y} in normalised [0,1] space.
 */
export function microDropletPos(
  p: ParticleData,
  progress: number, // 0→1 across the SMEDS dispersion shot
  burstProgress: number, // 0→1 burst expansion
): {x: number; y: number} {
  const expand = burstProgress * 0.42 * p.speed;
  const wobble = Math.sin(progress * Math.PI * 4 + p.phase) * 0.012;
  const cx = 0.5 + Math.cos(p.angle) * expand + wobble;
  const cy = 0.5 + Math.sin(p.angle) * expand * 0.7;
  return {
    x: Math.max(0.04, Math.min(0.96, cx)),
    y: Math.max(0.06, Math.min(0.88, cy)),
  };
}
