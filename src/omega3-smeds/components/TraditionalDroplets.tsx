import React, {useMemo} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {seededArray} from "../lib/seeded-random";

export type TraditionalDropletsProps = {
  releaseProgress: number; // 0: inside capsule, 1: fully released & dispersed
  originX?: number;
  originY?: number;
  opacity?: number;
};

type GlobuleData = {
  id: number;
  baseRadius: number;
  targetOffsetX: number;
  targetOffsetY: number;
  driftSpeed: number;
  wobbleSpeed: number;
  wobblePhase: number;
  emergeDelay: number; // 0 to 0.4
};

export const TraditionalDroplets: React.FC<TraditionalDropletsProps> = ({
  releaseProgress,
  originX = 680,
  originY = 520,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  const globuleCount = 11;

  // Pre-seed deterministic globule properties
  const globules = useMemo<GlobuleData[]>(() => {
    const rands = seededArray(101, globuleCount * 8);
    return Array.from({length: globuleCount}, (_, i) => {
      const angle = (rands[i * 8 + 0] * 1.5 - 0.75) * Math.PI; // mostly rightwards / upwards
      const dist = 120 + rands[i * 8 + 1] * 580;
      return {
        id: i,
        baseRadius: 28 + rands[i * 8 + 2] * 32, // 28px - 60px radius (large globules)
        targetOffsetX: Math.cos(angle) * dist + 150, // bias to right towards membrane
        targetOffsetY: Math.sin(angle) * (dist * 0.55),
        driftSpeed: 0.7 + rands[i * 8 + 3] * 0.6,
        wobbleSpeed: 0.04 + rands[i * 8 + 4] * 0.04,
        wobblePhase: rands[i * 8 + 5] * Math.PI * 2,
        emergeDelay: rands[i * 8 + 6] * 0.35,
      };
    });
  }, [globuleCount]);

  if (releaseProgress <= 0.02 || opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 22,
        opacity,
      }}
    >
      <svg width="100%" height="100%" style={{position: "absolute", inset: 0}}>
        <defs>
          {/* Amber oil globule gradient */}
          <radialGradient id="largeOilDrop" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.98" />
            <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#d97706" stopOpacity="0.9" />
            <stop offset="90%" stopColor="#92400e" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0.95" />
          </radialGradient>

          {/* Meniscus / surface tension highlight */}
          <linearGradient id="dropHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>

          {/* Drop shadow & glow */}
          <filter id="oilGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feOffset dx="0" dy="8" result="offset" />
            <feComponentTransfer in="offset" result="shadow">
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {globules.map((g) => {
          // Progress adjusted for staggered emergence
          const effectiveProgress = interpolate(
            releaseProgress,
            [g.emergeDelay, 1],
            [0, 1],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
          );

          if (effectiveProgress <= 0.01) return null;

          // Surface tension wobble (sinusoidal deformation)
          const wobble = Math.sin(frame * g.wobbleSpeed + g.wobblePhase);
          const rx = g.baseRadius * (1 + wobble * 0.08);
          const ry = g.baseRadius * (1 - wobble * 0.08);

          // Position interpolation from capsule center outward
          const currentX = originX + g.targetOffsetX * effectiveProgress;
          const currentY = originY + g.targetOffsetY * effectiveProgress + wobble * 8;

          // Scale smoothly upon emergence
          const scale = interpolate(effectiveProgress, [0, 0.25], [0.1, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g
              key={g.id}
              transform={`translate(${currentX}, ${currentY}) scale(${scale})`}
              filter="url(#oilGlow)"
            >
              {/* Outer meniscus / water-oil interface ring */}
              <ellipse
                cx="0"
                cy="0"
                rx={rx + 2.5}
                ry={ry + 2.5}
                fill="none"
                stroke="rgba(254, 240, 138, 0.45)"
                strokeWidth="2"
              />

              {/* Main oil body */}
              <ellipse
                cx="0"
                cy="0"
                rx={rx}
                ry={ry}
                fill="url(#largeOilDrop)"
              />

              {/* Specular gloss highlight (creates translucent spherical 3D volume) */}
              <ellipse
                cx={-rx * 0.32}
                cy={-ry * 0.35}
                rx={rx * 0.38}
                ry={ry * 0.22}
                fill="#ffffff"
                opacity={0.65}
                transform={`rotate(-25 ${-rx * 0.32} ${-ry * 0.35})`}
              />

              {/* Secondary bottom-edge caustic glow */}
              <ellipse
                cx="0"
                cy={ry * 0.52}
                rx={rx * 0.48}
                ry={ry * 0.18}
                fill="#fef08a"
                opacity={0.35}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
