import React from "react";
import {interpolate, useCurrentFrame} from "remotion";

export type SoftgelProps = {
  type: "traditional" | "smeds";
  ruptureProgress: number; // 0: intact, 1: fully opened/dissolved
  centerX?: number;
  centerY?: number;
  rotation?: number; // degrees
  scale?: number;
};

export const Softgel: React.FC<SoftgelProps> = ({
  type,
  ruptureProgress,
  centerX = 680,
  centerY = 520,
  rotation = -12,
  scale = 1,
}) => {
  const frame = useCurrentFrame();

  // Subtle floating oscillation
  const floatY = Math.sin(frame * 0.04) * 6;
  const floatRot = Math.cos(frame * 0.03) * 2;

  // Rupture dissolution & split parameters
  const shellOpacity = interpolate(ruptureProgress, [0, 0.4, 0.9, 1], [1, 0.85, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seamSplit = interpolate(ruptureProgress, [0.1, 0.7], [0, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isSMEDS = type === "smeds";

  // Color palettes
  const amberDeep = isSMEDS ? "#d97706" : "#b45309";
  const amberMid = isSMEDS ? "#f59e0b" : "#d97706";
  const amberBright = isSMEDS ? "#fef08a" : "#fde68a";
  const glowColor = isSMEDS ? "rgba(56, 189, 248, 0.35)" : "rgba(245, 158, 11, 0.35)";

  if (shellOpacity <= 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: centerX,
        top: centerY + floatY,
        transform: `translate(-50%, -50%) rotate(${rotation + floatRot}deg) scale(${scale})`,
        opacity: shellOpacity,
        transformOrigin: "center center",
        zIndex: 25,
        pointerEvents: "none",
      }}
    >
      <svg
        width="340"
        height="180"
        viewBox="0 0 340 180"
        fill="none"
        style={{filter: `drop-shadow(0 20px 45px rgba(0,0,0,0.6)) drop-shadow(0 0 35px ${glowColor})`}}
      >
        <defs>
          {/* Liquid oil core gradient */}
          <radialGradient id={`oilCore-${type}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor={amberBright} stopOpacity="0.95" />
            <stop offset="45%" stopColor={amberMid} stopOpacity="0.9" />
            <stop offset="85%" stopColor={amberDeep} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.9" />
          </radialGradient>

          {/* Gelatin shell rim gradient */}
          <linearGradient id={`shellRim-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="25%" stopColor={amberBright} stopOpacity="0.3" />
            <stop offset="80%" stopColor={amberMid} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>

          {/* Specular gloss highlight */}
          <linearGradient id={`glossGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* SMEDS emulsion fine particulate texture */}
          {isSMEDS && (
            <radialGradient id="smedsAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* Softgel outer body - capsule shape */}
        {/* Left half / Upper shell */}
        <g style={{transform: `translateY(-${seamSplit * 0.5}px)`}}>
          <path
            d="M 80 20 L 260 20 C 300 20 325 55 325 90 L 15 90 C 15 55 40 20 80 20 Z"
            fill={`url(#oilCore-${type})`}
            stroke={`url(#shellRim-${type})`}
            strokeWidth="3.5"
          />
          {/* Specular glass reflection along upper rim */}
          <path
            d="M 90 28 Q 170 24 250 28"
            stroke="url(#glossGrad-${type})"
            strokeWidth="5"
            strokeLinecap="round"
            opacity={0.85}
          />
          <ellipse cx="110" cy="40" rx="35" ry="12" fill="#ffffff" opacity="0.3" />
        </g>

        {/* Right half / Lower shell */}
        <g style={{transform: `translateY(${seamSplit * 0.5}px)`}}>
          <path
            d="M 15 90 L 325 90 C 325 125 300 160 260 160 L 80 160 C 40 160 15 125 15 90 Z"
            fill={`url(#oilCore-${type})`}
            stroke={`url(#shellRim-${type})`}
            strokeWidth="3.5"
          />
          {/* Lower rim bounce reflection */}
          <path
            d="M 95 150 Q 170 154 245 150"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={0.35}
          />
        </g>

        {/* Capsule seam split line */}
        <line
          x1="20"
          y1="90"
          x2="320"
          y2="90"
          stroke={isSMEDS ? "#38bdf8" : "#fbbf24"}
          strokeWidth={1.5 + seamSplit * 0.3}
          strokeOpacity={0.6 + seamSplit * 0.02}
        />

        {/* SMEDS dynamic micro-emulsion internal sheen */}
        {isSMEDS && (
          <ellipse
            cx="170"
            cy="90"
            rx="120"
            ry="45"
            fill="url(#smedsAura)"
            opacity={0.7}
          />
        )}
      </svg>
    </div>
  );
};
