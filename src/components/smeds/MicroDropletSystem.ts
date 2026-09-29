/**
 * Deterministic physics simulation for Traditional Macro Droplets
 * and SMEDS Micro-Emulsion Droplets.
 *
 * All coordinates are normalized to [0, 1] relative to viewport width/height,
 * and scaled to pixel coordinates based on canvas resolution.
 */

export type MacroDropletState = {
  id: number;
  x: number; // 0..1
  y: number; // 0..1
  radius: number; // in pixels
  wobblePhase: number;
  opacity: number;
  clumpGroup: number;
};

export type CapsuleState = {
  x: number;
  y: number;
  angle: number; // in radians
  length: number;
  radius: number;
  ruptureProgress: number; // 0 (sealed) to 1 (ruptured)
  shellOpacity: number;
  glowIntensity: number;
};

export type MicroDroplet = {
  seed: number;
  angle: number;
  baseSpeed: number;
  burstDelay: number; // frame offset after rupture
  maxSpread: number; // target spread distance in pixels
  radius: number;
  turbulenceFreq: number;
  driftX: number;
  driftY: number;
  zDepth: number; // 0 (far) to 1 (near) for depth-of-field
};

// Deterministic pseudo-random number generator (Mulberry32)
function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pre-generate static properties for the 2,400 SMEDS micro-droplets.
 */
export function generateMicroDroplets(count: number = 2400): MicroDroplet[] {
  const rng = mulberry32(133742);
  const droplets: MicroDroplet[] = [];

  for (let i = 0; i < count; i++) {
    // Distribute angles in 360 degrees with a forward/rightward ejection bias
    const rawAngle = rng() * Math.PI * 2;
    const biasAngle = -Math.PI * 0.12 + (rng() - 0.5) * Math.PI * 1.5;
    const angle = rng() > 0.25 ? biasAngle : rawAngle;

    // Radius distribution: mostly 1.5px - 3.8px (microscopic)
    const rNorm = Math.pow(rng(), 2.0);
    const radius = 1.6 + rNorm * 2.8;

    // Controlled spread radius within viewport bounds (120px to 680px)
    const maxSpread = 120 + rng() * 560;

    droplets.push({
      seed: rng(),
      angle,
      baseSpeed: 0.4 + rng() * 0.8,
      burstDelay: Math.floor(rng() * 42), // staggered burst over ~1.4s
      maxSpread,
      radius,
      turbulenceFreq: 0.8 + rng() * 2.4,
      driftX: (rng() - 0.5) * 0.025,
      driftY: (rng() - 0.5) * 0.02 - 0.003, // subtle buoyancy
      zDepth: rng(),
    });
  }

  return droplets;
}

/**
 * Calculate the traditional softgel capsule state for a given local frame.
 */
export function getTraditionalCapsuleState(
  localFrame: number,
): CapsuleState {
  // Capsule descends from upper-left, slows down in viscous fluid
  const enterT = Math.min(1, Math.max(0, localFrame / 42));
  const smoothEnter = 1 - Math.pow(1 - enterT, 3);

  const x = 0.22 + smoothEnter * 0.14 + Math.sin(localFrame * 0.04) * 0.008;
  const y = 0.12 + smoothEnter * 0.32 + Math.cos(localFrame * 0.035) * 0.01;
  const angle = 0.45 - smoothEnter * 0.15 + Math.sin(localFrame * 0.03) * 0.04;

  // Rupture begins around frame 36
  const ruptureT = Math.min(1, Math.max(0, (localFrame - 36) / 32));
  const shellOpacity = Math.max(0, 1 - Math.max(0, (localFrame - 95) / 32));

  return {
    x,
    y,
    angle,
    length: 130,
    radius: 46,
    ruptureProgress: ruptureT,
    shellOpacity,
    glowIntensity: 0.3 + Math.sin(localFrame * 0.08) * 0.1,
  };
}

/**
 * Calculate the traditional macro oil globules (18-24 large droplets).
 * High surface tension: they emerge, resist mixing, clump together, and float upward.
 */
export function getTraditionalMacroDroplets(
  localFrame: number,
  count: number = 22,
): MacroDropletState[] {
  const rng = mulberry32(98765);
  const droplets: MacroDropletState[] = [];

  const ruptureStart = 36;
  if (localFrame < ruptureStart) {
    return [];
  }

  // Capsule rupture point in normalized coordinates
  const originX = 0.38;
  const originY = 0.46;

  // Clump target centers (macro droplets coalesce into floating sticky clusters)
  const clumpCenters = [
    {x: 0.58, y: 0.26},
    {x: 0.68, y: 0.22},
    {x: 0.62, y: 0.34},
  ];

  for (let i = 0; i < count; i++) {
    const ejectionDelay = i * 2.5;
    const age = localFrame - ruptureStart - ejectionDelay;

    if (age <= 0) continue;

    const seedAngle = rng() * Math.PI * 2;
    const baseRadius = 26 + rng() * 32; // large: 26px - 58px
    const clumpIdx = i % clumpCenters.length;
    const clump = clumpCenters[clumpIdx];

    const emergeProgress = Math.min(1, age / 28);
    const clumpProgress = Math.min(1, Math.max(0, (age - 22) / 50));
    const floatProgress = Math.min(1, Math.max(0, (age - 55) / 55));

    // Initial ejection vector
    const speed = 0.07 + rng() * 0.10;
    const ejectX = originX + Math.cos(seedAngle) * speed * emergeProgress;
    const ejectY = originY + Math.sin(seedAngle) * speed * emergeProgress;

    // Cohesion to clump center with slight offset
    const clumpOffsetX = (rng() - 0.5) * 0.08;
    const clumpOffsetY = (rng() - 0.5) * 0.07;
    const targetX = clump.x + clumpOffsetX;
    const targetY = clump.y + clumpOffsetY - floatProgress * 0.05; // buoyant lift

    const curX = ejectX * (1 - clumpProgress) + targetX * clumpProgress;
    const curY = ejectY * (1 - clumpProgress) + targetY * clumpProgress;

    const wobblePhase = age * 0.07 + i;
    const wobble = Math.sin(wobblePhase) * 0.04;
    const currentRadius = baseRadius * Math.min(1, age / 10) * (1 + wobble);

    droplets.push({
      id: i,
      x: curX + Math.sin(age * 0.03 + i) * 0.005,
      y: curY + Math.cos(age * 0.025 + i * 2) * 0.004,
      radius: currentRadius,
      wobblePhase,
      opacity: Math.min(1, age / 8),
      clumpGroup: clumpIdx,
    });
  }

  return droplets;
}

/**
 * Calculate the SMEDS softgel capsule state for a given local frame.
 */
export function getSmedsCapsuleState(
  localFrame: number,
): CapsuleState {
  const enterT = Math.min(1, Math.max(0, localFrame / 32));
  const smoothEnter = 1 - Math.pow(1 - enterT, 3);

  const x = 0.28 + smoothEnter * 0.12 + Math.sin(localFrame * 0.04) * 0.006;
  const y = 0.15 + smoothEnter * 0.32 + Math.cos(localFrame * 0.035) * 0.008;
  const angle = 0.38 - smoothEnter * 0.12 + Math.sin(localFrame * 0.03) * 0.03;

  // Rupture begins at frame 28
  const ruptureT = Math.min(1, Math.max(0, (localFrame - 28) / 24));
  const shellOpacity = Math.max(0, 1 - Math.max(0, (localFrame - 75) / 28));

  return {
    x,
    y,
    angle,
    length: 130,
    radius: 46,
    ruptureProgress: ruptureT,
    shellOpacity,
    glowIntensity: 0.6 + Math.sin(localFrame * 0.1) * 0.25,
  };
}

/**
 * Intermediate fragmentation droplets during SMEDS rupture (frames 28 - 75).
 * Large globule -> breaking into smaller intermediate droplets -> shatters into micro-droplets.
 */
export function getSmedsFragmentationDroplets(
  localFrame: number,
): MacroDropletState[] {
  const ruptureStart = 28;
  const age = localFrame - ruptureStart;
  if (age < 0 || age > 50) return [];

  const rng = mulberry32(54321);
  const count = 10;
  const droplets: MacroDropletState[] = [];

  const originX = 0.40;
  const originY = 0.47;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const speed = 0.03 + rng() * 0.08;
    // Shrinking and fragmenting as micro-droplets burst out
    const progress = age / 40;
    const radius = Math.max(0, (26 - progress * 24) * (0.8 + rng() * 0.4));
    if (radius < 2) continue;

    const px = originX + Math.cos(angle) * speed * age * 0.15;
    const py = originY + Math.sin(angle) * speed * age * 0.12;

    droplets.push({
      id: 100 + i,
      x: px,
      y: py,
      radius,
      wobblePhase: age * 0.2 + i,
      opacity: Math.max(0, 1 - progress * 1.2),
      clumpGroup: 0,
    });
  }

  return droplets;
}

/**
 * Calculate current positions of SMEDS micro-droplets.
 * Mechanism:
 * 1. Oil initially emerges as a concentrated globule at rupture point (0.40, 0.47)
 * 2. Instantaneous self-emulsification: interfacial tension collapses!
 * 3. Violent/rapid fragmentation into thousands of tiny droplets (<50 nm representation)
 * 4. Micro-droplet cloud spreads rapidly and uniformly across the entire fluid column.
 */
export function computeSmedsMicroPositions(
  microDroplets: MicroDroplet[],
  localFrame: number,
  ruptureFrame: number = 28,
  canvasWidth: number = 1920,
  canvasHeight: number = 1080,
): Float32Array {
  // Output format per droplet: [x, y, radius, opacity, depth] (5 floats per particle)
  const count = microDroplets.length;
  const data = new Float32Array(count * 5);

  const originX = 0.40 * canvasWidth;
  const originY = 0.47 * canvasHeight;

  const ageSinceRupture = localFrame - ruptureFrame;
  if (ageSinceRupture < 0) {
    return data;
  }

  for (let i = 0; i < count; i++) {
    const d = microDroplets[i];
    const particleAge = ageSinceRupture - d.burstDelay;

    if (particleAge <= 0) {
      data[i * 5 + 3] = 0; // invisible
      continue;
    }

    // Smooth bounded expansion: rapidly reaches spread radius, then stays in fluid
    const spreadT = 1 - Math.exp(-particleAge / 36);
    const radialDist = d.maxSpread * spreadT;

    // Fluid vortex turbulence
    const curlAngle =
      d.angle +
      Math.sin(particleAge * 0.04 * d.turbulenceFreq + d.seed * 6.28) * 0.7 +
      Math.cos(particleAge * 0.025 + d.seed * 4.2) * 0.4;

    let px = originX + Math.cos(curlAngle) * radialDist;
    let py = originY + Math.sin(curlAngle) * radialDist * 0.85;

    // Gentle continuous fluid drift after expansion
    const driftSpread = Math.min(1, particleAge / 50);
    const driftX = (d.driftX * 450 + Math.sin(d.seed * 80 + particleAge * 0.025) * 55) * driftSpread;
    const driftY = (d.driftY * 350 + Math.cos(d.seed * 60 + particleAge * 0.02) * 45) * driftSpread;

    px += driftX;
    py += driftY;

    // Fast luminous reveal, sustained high opacity
    const fadeIn = Math.min(1, particleAge / 6);
    const opacity = fadeIn * (0.80 + d.seed * 0.20);

    data[i * 5 + 0] = px;
    data[i * 5 + 1] = py;
    data[i * 5 + 2] = d.radius;
    data[i * 5 + 3] = opacity;
    data[i * 5 + 4] = d.zDepth;
  }

  return data;
}
