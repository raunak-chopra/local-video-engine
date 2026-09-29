import React, {useMemo} from "react";
import {AbsoluteFill, interpolate} from "remotion";

export type FluidBackgroundProps = {
  frame: number;
};

type FloatingVesicle = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  driftX: number;
  driftY: number;
  opacity: number;
  blur: number;
};

export const FluidBackground: React.FC<FluidBackgroundProps> = ({frame}) => {
  // Pre-compute 38 suspended micro-vesicles for aqueous stomach fluid depth
  const vesicles = useMemo<FloatingVesicle[]>(() => {
    const list: FloatingVesicle[] = [];
    for (let i = 0; i < 38; i++) {
      // Deterministic distribution
      const pseudoRand = (seed: number) => {
        const x = Math.sin(seed * 9999 + i * 1337) * 10000;
        return x - Math.floor(x);
      };

      const depth = pseudoRand(1);
      list.push({
        x: pseudoRand(2),
        y: pseudoRand(3),
        radius: 2 + depth * 7,
        speed: 0.0003 + depth * 0.0006,
        driftX: (pseudoRand(4) - 0.5) * 0.08,
        driftY: -0.04 - pseudoRand(5) * 0.08,
        opacity: 0.15 + depth * 0.35,
        blur: Math.abs(depth - 0.5) * 6,
      });
    }
    return list;
  }, []);

  // Caustic light rays swaying subtly
  const causticPhase1 = Math.sin(frame * 0.02) * 25;
  const causticPhase2 = Math.cos(frame * 0.015) * 35;
  const causticOpacity = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.12, 0.22],
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        // Deep biomedical gastric fluid: deep oceanic indigo/teal
        background:
          "radial-gradient(ellipse at 50% 15%, #082a42 0%, #041726 45%, #020b14 85%)",
      }}
    >
      {/* Volumetric Caustic Light Beams filtering down from above */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: `calc(15% + ${causticPhase1}px)`,
          width: "45%",
          height: "140%",
          background:
            "linear-gradient(135deg, rgba(80, 220, 255, 0.18) 0%, rgba(20, 140, 200, 0.04) 55%, transparent 80%)",
          filter: "blur(60px)",
          transform: "rotate(-12deg)",
          pointerEvents: "none",
          opacity: causticOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: `calc(10% + ${causticPhase2}px)`,
          width: "55%",
          height: "150%",
          background:
            "linear-gradient(220deg, rgba(100, 240, 255, 0.14) 0%, rgba(10, 120, 180, 0.03) 60%, transparent 85%)",
          filter: "blur(80px)",
          transform: "rotate(8deg)",
          pointerEvents: "none",
          opacity: causticOpacity * 0.9,
        }}
      />

      {/* Warm Golden Subsurface Light Diffusion in midground */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "42%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.03) 50%, transparent 70%)",
          filter: "blur(70px)",
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.04) * 0.08})`,
          pointerEvents: "none",
        }}
      />

      {/* Floating Micro-Vesicles & Biological Fluid Dust with Depth of Field */}
      {vesicles.map((v, i) => {
        const curY = (v.y + frame * v.driftY * 0.02 + 10) % 1.2 - 0.1;
        const curX = (v.x + Math.sin(frame * 0.03 + i) * v.driftX * 0.02 + 1) % 1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${curX * 100}%`,
              top: `${curY * 100}%`,
              width: v.radius * 2,
              height: v.radius * 2,
              borderRadius: "50%",
              background: "rgba(160, 230, 255, 0.85)",
              boxShadow: `0 0 ${v.radius * 3}px rgba(80, 210, 255, 0.6)`,
              opacity: v.opacity,
              filter: `blur(${v.blur}px)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Cinematic Edge Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 160px rgba(1, 6, 12, 0.85)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
