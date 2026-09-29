import React from "react";
import {useCurrentFrame} from "remotion";

export const AbsorptionMembrane: React.FC<{
  pulseIntensity?: number; // 0 to 1, increases during SMEDS microdispersion
}> = ({pulseIntensity = 0}) => {
  const frame = useCurrentFrame();

  // Subtle fluid undulation
  const wave1 = Math.sin(frame * 0.04) * 8;
  const wave2 = Math.cos(frame * 0.035) * 12;

  // Luminous cellular glow intensity
  const baseGlow = 0.25 + Math.sin(frame * 0.05) * 0.08;
  const totalGlow = Math.min(1, baseGlow + pulseIntensity * 0.65);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 380,
        height: "100%",
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      {/* Background depth shadow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(5, 30, 48, 0.4) 40%, rgba(6, 40, 60, 0.85) 100%)",
        }}
      />

      {/* Curved membrane boundary SVG */}
      <svg
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 360,
          height: "105%",
        }}
        viewBox="0 0 360 1120"
        fill="none"
      >
        <defs>
          <linearGradient id="membraneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.15 * totalGlow} />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity={0.45 * totalGlow} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2 * totalGlow} />
          </linearGradient>

          <filter id="membraneGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft back layer */}
        <path
          d={`M ${120 + wave2} 0 Q ${60 + wave1} 560 ${100 + wave2} 1120 L 360 1120 L 360 0 Z`}
          fill="url(#membraneGrad)"
          opacity={0.6}
        />

        {/* Crisp boundary line with glow */}
        <path
          d={`M ${140 + wave1} 0 Q ${80 + wave2} 560 ${120 + wave1} 1120`}
          stroke="#38bdf8"
          strokeWidth="3"
          strokeOpacity={0.5 + totalGlow * 0.4}
          filter="url(#membraneGlow)"
        />

        {/* Micro-villi / receptor ridges along membrane */}
        {Array.from({length: 22}).map((_, i) => {
          const y = i * 50 + 25;
          const curveOffset = Math.sin((y / 1120) * Math.PI) * 50;
          const x = 110 + curveOffset + Math.sin(frame * 0.05 + i * 0.6) * 5;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={18 + Math.sin(frame * 0.06 + i) * 4}
              ry={10}
              fill="rgba(56, 189, 248, 0.12)"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="1"
              transform={`rotate(${-10 + Math.sin(i) * 15} ${x} ${y})`}
            />
          );
        })}
      </svg>

      {/* Surface contact absorption light flare when SMEDS microdroplets reach */}
      {pulseIntensity > 0.05 && (
        <div
          style={{
            position: "absolute",
            top: "25%",
            right: 40,
            width: 220,
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 80%)",
            filter: "blur(24px)",
            opacity: pulseIntensity,
            transform: `scale(${0.9 + Math.sin(frame * 0.1) * 0.15})`,
          }}
        />
      )}

      {/* Label for absorption boundary */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          right: 48,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 2,
          color: "rgba(148, 163, 184, 0.55)",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        Absorption Surface
      </div>
    </div>
  );
};
