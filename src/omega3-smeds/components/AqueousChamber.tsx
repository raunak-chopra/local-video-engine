import React, {useMemo} from "react";
import {useCurrentFrame} from "remotion";
import {buildParticles} from "../lib/droplet-motion";
import {seededArray} from "../lib/seeded-random";

export type AqueousChamberProps = {
  children?: React.ReactNode;
  cameraScale?: number;
  cameraX?: number;
  cameraY?: number;
  accentScheme?: "amber-muted" | "cyan-active";
};

export const AqueousChamber: React.FC<AqueousChamberProps> = ({
  children,
  cameraScale = 1,
  cameraX = 0,
  cameraY = 0,
  accentScheme = "amber-muted",
}) => {
  const frame = useCurrentFrame();

  // Deterministic floating aqueous particulates
  const particulateCount = 40;
  const particulateData = useMemo(() => {
    const rands = seededArray(42, particulateCount * 7);
    return buildParticles(rands, particulateCount);
  }, [particulateCount]);

  // Caustic light oscillation
  const causticPhase1 = frame * 0.025;
  const causticPhase2 = frame * 0.018;

  // Background colors depending on accent scheme
  const isCyan = accentScheme === "cyan-active";
  const bgCenter = isCyan ? "#082736" : "#0a222f";
  const bgMid = isCyan ? "#041624" : "#051824";
  const bgOuter = "#020b12";

  // Caustic brightness
  const causticOpacity = isCyan ? 0.22 : 0.16;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: bgOuter,
        background: `radial-gradient(ellipse at 42% 40%, ${bgCenter} 0%, ${bgMid} 55%, ${bgOuter} 100%)`,
      }}
    >
      {/* Caustic light rays layer */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "120%",
          height: "140%",
          opacity: causticOpacity,
          backgroundImage: `
            radial-gradient(circle at ${40 + Math.sin(causticPhase1) * 8}% ${30 + Math.cos(causticPhase2) * 10}%, rgba(56, 189, 248, 0.45) 0%, transparent 45%),
            radial-gradient(circle at ${65 + Math.cos(causticPhase1) * 6}% ${55 + Math.sin(causticPhase2) * 8}%, rgba(45, 212, 191, 0.3) 0%, transparent 40%),
            radial-gradient(circle at ${25 + Math.sin(causticPhase2) * 5}% ${70 + Math.cos(causticPhase1) * 6}%, rgba(14, 165, 233, 0.25) 0%, transparent 35%)
          `,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle fluid refractive grid / flow texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          transform: `translateY(${Math.sin(frame * 0.02) * 10}px) perspective(1200px) rotateX(15deg)`,
          pointerEvents: "none",
        }}
      />

      {/* Suspended water micro-particulates */}
      {particulateData.map((p, idx) => {
        const floatY = (p.y0 * 1080 + Math.sin(frame * 0.03 * p.speed + p.phase) * 35) % 1080;
        const floatX = (p.x0 * 1920 + Math.cos(frame * 0.02 * p.speed + p.phase) * 25) % 1920;
        const opacity = (0.2 + p.opacitySeed * 0.4) * (0.7 + Math.sin(frame * 0.04 + p.phase) * 0.3);
        const size = 2 + p.scale * 3.5;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: floatX,
              top: floatY,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: isCyan ? "rgba(125, 211, 252, 0.85)" : "rgba(253, 224, 71, 0.6)",
              boxShadow: isCyan
                ? `0 0 ${size * 2}px rgba(56, 189, 248, 0.6)`
                : `0 0 ${size * 2}px rgba(251, 191, 36, 0.5)`,
              opacity,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Camera transformed layer for 3D depth and motion */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale}) translate(${cameraX}px, ${cameraY}px)`,
          transformOrigin: "45% 50%",
          willChange: "transform",
        }}
      >
        {children}
      </div>

      {/* Vignette & Depth Fog overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(1, 8, 14, 0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
