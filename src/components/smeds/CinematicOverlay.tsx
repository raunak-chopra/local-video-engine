import React from "react";
import {interpolate, spring, useVideoConfig} from "remotion";

export type CinematicOverlayProps = {
  scene: "traditional" | "transition" | "smeds" | "hero_comparison";
  localFrame: number;
};

const CYAN = "#5eead4";
const GOLD = "#fbbf24";
const ALERT = "#fb7185";

export const CinematicOverlay: React.FC<CinematicOverlayProps> = ({
  scene,
  localFrame,
}) => {
  const {fps} = useVideoConfig();

  // Reveal animation using spring
  const enter = spring({
    frame: localFrame,
    fps,
    config: {damping: 18, stiffness: 90},
  });

  const fadeOut =
    scene === "transition"
      ? interpolate(localFrame, [40, 58], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = enter * fadeOut;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        padding: 68, // Strictly outside 64px safe area
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity,
      }}
    >
      {/* Top Header Bar */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
        {/* Left Telemetry Card */}
        <div
          style={{
            background: "rgba(3, 14, 26, 0.72)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "16px 24px",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.35)",
            maxWidth: 540,
          }}
        >
          {scene === "traditional" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: ALERT,
                    boxShadow: `0 0 12px ${ALERT}`,
                  }}
                />
                Conventional Softgel
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginTop: 6,
                  letterSpacing: -0.5,
                }}
              >
                Traditional Omega-3 Oil
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#cbd5e1",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                Large oil droplets (100–500 µm) resist aqueous mixing and remain
                phase-separated.
              </div>
            </>
          )}

          {scene === "transition" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: CYAN,
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: CYAN,
                    boxShadow: `0 0 12px ${CYAN}`,
                  }}
                />
                Delivery Breakthrough
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginTop: 6,
                  letterSpacing: -0.5,
                }}
              >
                SMEDS Technology
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#cbd5e1",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                Self-Micro-Emulsifying Drug Delivery System: spontaneous micro-dispersion.
              </div>
            </>
          )}

          {scene === "smeds" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: GOLD,
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: GOLD,
                    boxShadow: `0 0 12px ${GOLD}`,
                  }}
                />
                Advanced Formulation
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginTop: 6,
                  letterSpacing: -0.5,
                }}
              >
                Spontaneous Micro-Emulsification
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#cbd5e1",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                Thousands of microscopic droplets (&lt;50 nm) form instantly for uniform fluid dispersion.
              </div>
            </>
          )}

          {scene === "hero_comparison" && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: CYAN,
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: CYAN,
                    boxShadow: `0 0 12px ${CYAN}`,
                  }}
                />
                Direct Mechanism Comparison
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginTop: 6,
                  letterSpacing: -0.5,
                }}
              >
                Macro Droplets vs. SMEDS Cloud
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#cbd5e1",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                Massive surface area expansion enables optimal absorption even without a fatty meal.
              </div>
            </>
          )}
        </div>

        {/* Right Status Badge */}
        <div
          style={{
            background: "rgba(3, 14, 26, 0.72)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "14px 22px",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.35)",
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            Aqueous Dispersion Status
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 750,
              color:
                scene === "traditional"
                  ? ALERT
                  : scene === "transition"
                    ? CYAN
                    : GOLD,
              marginTop: 4,
            }}
          >
            {scene === "traditional" && "Poor • Phase Separated"}
            {scene === "transition" && "Transitioning Formulation"}
            {scene === "smeds" && "Rapid • Uniform Dispersion"}
            {scene === "hero_comparison" && "5× Surface Area Multiplier"}
          </div>
        </div>
      </div>

      {/* Hero Climax Comparison Split Annotations (For scene 4) */}
      {scene === "hero_comparison" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          {/* Traditional side callout */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(251, 113, 133, 0.3)",
              borderRadius: 14,
              padding: "12px 20px",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{color: ALERT, fontWeight: 750, fontSize: 18}}>
              Traditional Softgel
            </div>
            <div style={{color: "#94a3b8", fontSize: 14, marginTop: 4}}>
              Clumped oil layer • Low biological surface contact
            </div>
          </div>

          {/* SMEDS side callout */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              borderRadius: 14,
              padding: "12px 20px",
              backdropFilter: "blur(12px)",
              textAlign: "right",
            }}
          >
            <div style={{color: GOLD, fontWeight: 750, fontSize: 18}}>
              SMEDS Delivery System
            </div>
            <div style={{color: "#cbd5e1", fontSize: 14, marginTop: 4}}>
              Thousands of micro-droplets • Uniform colloidal distribution
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
