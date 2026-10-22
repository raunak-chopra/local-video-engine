import React, {useMemo} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {seededArray} from "../lib/seeded-random";

export type MicroDropletFieldProps = {
  activationProgress: number; // 0 to 1 (Shot 5: rupture & vortex)
  dispersionProgress: number; // 0 to 1 (Shot 6: full chamber dispersion)
  originX?: number;
  originY?: number;
  showReferenceDrop?: boolean;
};

type MicroParticle = {
  id: number;
  angle: number;
  radiusMin: number;
  radiusMax: number;
  speed: number;
  size: number;
  vortexSpin: number;
  phase: number;
  membraneTargetX: number;
  membraneTargetY: number;
};

export const MicroDropletField: React.FC<MicroDropletFieldProps> = ({
  activationProgress,
  dispersionProgress,
  originX = 720,
  originY = 520,
  showReferenceDrop = true,
}) => {
  const frame = useCurrentFrame();

  const particleCount = 320;

  // Deterministically precompute particle trajectories
  const particles = useMemo<MicroParticle[]>(() => {
    const rands = seededArray(777, particleCount * 8);
    return Array.from({length: particleCount}, (_, i) => {
      const angle = rands[i * 8 + 0] * Math.PI * 2;
      const radiusMin = 30 + rands[i * 8 + 1] * 220;
      const radiusMax = 200 + rands[i * 8 + 2] * 900;
      const size = 3 + rands[i * 8 + 3] * 5.5; // 3px to 8.5px
      const speed = 0.7 + rands[i * 8 + 4] * 0.8;
      const vortexSpin = (rands[i * 8 + 5] - 0.5) * 4;
      const phase = rands[i * 8 + 6] * Math.PI * 2;

      // Distribution across chamber toward membrane
      const membraneTargetX = 400 + rands[i * 8 + 7] * 1250;
      const membraneTargetY = 120 + rands[i * 8 + 1] * 840;

      return {
        id: i,
        angle,
        radiusMin,
        radiusMax,
        speed,
        size,
        vortexSpin,
        phase,
        membraneTargetX,
        membraneTargetY,
      };
    });
  }, [particleCount]);

  if (activationProgress <= 0.01) return null;

  // Reference large drop that dissolves during Shot 5
  // "Instead of large oil drops, it forms microscopic droplets"
  const refDropScale = interpolate(
    activationProgress,
    [0, 0.45, 0.8],
    [0.9, 0.75, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const refDropOpacity = interpolate(
    activationProgress,
    [0.35, 0.75],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 24,
      }}
    >
      <svg width="100%" height="100%" style={{position: "absolute", inset: 0}}>
        <defs>
          {/* Microdroplet radiant golden gradient */}
          <radialGradient id="microDropGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </radialGradient>

          {/* Reference drop gradient */}
          <radialGradient id="refOilDrop" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.85" />
          </radialGradient>

          <filter id="microGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Temporary large reference drop showing the contrast */}
        {showReferenceDrop && refDropScale > 0.02 && (
          <g
            transform={`translate(${originX + 160}, ${originY - 40}) scale(${refDropScale})`}
            opacity={refDropOpacity}
          >
            <circle
              cx="0"
              cy="0"
              r="46"
              fill="url(#refOilDrop)"
              stroke="rgba(254, 240, 138, 0.6)"
              strokeWidth="2"
            />
            <ellipse cx="-14" cy="-16" rx="16" ry="9" fill="#ffffff" opacity="0.6" />
            {/* Outline showing comparison */}
            <circle
              cx="0"
              cy="0"
              r="52"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity={0.7}
            />
          </g>
        )}

        {/* Instanced Microdroplet field */}
        {particles.map((p) => {
          // Combined vortex + dispersion physics
          const spiralAngle =
            p.angle +
            activationProgress * p.vortexSpin * Math.PI +
            dispersionProgress * 0.5 * Math.PI;

          // Activation stage: spiral outward from capsule
          const rStage1 = p.radiusMin * activationProgress * p.speed;
          const vortexX = originX + Math.cos(spiralAngle) * rStage1;
          const vortexY = originY + Math.sin(spiralAngle) * rStage1 * 0.7;

          // Dispersion stage: expand widely to target coordinates across chamber
          const finalX = interpolate(
            dispersionProgress,
            [0, 1],
            [vortexX, p.membraneTargetX],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
          );

          const finalY = interpolate(
            dispersionProgress,
            [0, 1],
            [vortexY, p.membraneTargetY],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
          );

          // Gentle fluid oscillation
          const fluidY = finalY + Math.sin(frame * 0.04 * p.speed + p.phase) * 5;
          const fluidX = finalX + Math.cos(frame * 0.03 * p.speed + p.phase) * 4;

          // Opacity fades in as activation starts
          const pOpacity = interpolate(
            activationProgress,
            [0, 0.15, 0.4],
            [0, 0.6, 0.95],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
          );

          return (
            <circle
              key={p.id}
              cx={fluidX}
              cy={fluidY}
              r={p.size * (0.8 + activationProgress * 0.2)}
              fill="url(#microDropGrad)"
              opacity={pOpacity}
              filter="url(#microGlow)"
            />
          );
        })}
      </svg>
    </div>
  );
};
