import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Caption} from "../components/Caption";
import {AbsorptionMembrane} from "./components/AbsorptionMembrane";
import {AqueousChamber} from "./components/AqueousChamber";
import {DraftWatermark} from "./components/DraftWatermark";
import {EndCard} from "./components/EndCard";
import {MicroDropletField} from "./components/MicroDropletField";
import {ScientificLabel} from "./components/ScientificLabel";
import {Softgel} from "./components/Softgel";
import {TraditionalDroplets} from "./components/TraditionalDroplets";
import type {SmedsVideoProject} from "./types";

export const Omega3SmedsScene: React.FC<{project: SmedsVideoProject}> = ({
  project,
}) => {
  const frame = useCurrentFrame();

  // Phase milestones in frames
  // Shot 1: 0 - 35
  // Shot 2: 35 - 125
  // Shot 3: 125 - 185
  // Shot 4: 185 - 225 (Transition)
  // Shot 5: 225 - 335
  // Shot 6: 335 - 460
  // Shot 7: 460 - 540

  const isSmedsPhase = frame >= 205;

  // Camera scale and pan interpolation
  let cameraScale = 1;
  let cameraX = 0;
  let cameraY = 0;

  if (frame < 185) {
    // Shots 1 - 3: Slow establishing push and subtle rightward pan
    cameraScale = interpolate(frame, [0, 185], [0.96, 1.08], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraX = interpolate(frame, [0, 185], [20, -50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraY = interpolate(frame, [0, 185], [10, -10], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame < 225) {
    // Shot 4: Transition - rapid surge through one droplet
    cameraScale = interpolate(frame, [185, 205, 225], [1.08, 3.2, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraX = interpolate(frame, [185, 205, 225], [-50, -180, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraY = interpolate(frame, [185, 205, 225], [-10, 20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else {
    // Shots 5 - 7: Lateral move across SMEDS dispersion chamber and settling hold
    cameraScale = interpolate(frame, [225, 460, 540], [1.02, 1.12, 1.1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraX = interpolate(frame, [225, 460, 540], [30, -90, -90], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraY = interpolate(frame, [225, 460, 540], [0, -15, -15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Full-screen amber droplet pass-through transition overlay
  const transitionAmberCover = interpolate(
    frame,
    [185, 202, 208, 225],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  // Traditional softgel rupture progress (Shot 2: 35 - 110)
  const traditionalRupture = interpolate(frame, [35, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Traditional droplet emergence and drift (Shot 2 - 3: 40 - 185)
  const traditionalDropletRelease = interpolate(frame, [45, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const traditionalDropletsOpacity = interpolate(frame, [185, 205], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SMEDS softgel rupture progress (Shot 5: 235 - 310)
  const smedsRupture = interpolate(frame, [235, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SMEDS microdroplet activation (Shot 5: 240 - 335)
  const smedsActivation = interpolate(frame, [240, 335], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SMEDS rapid microdispersion across chamber (Shot 6: 335 - 460)
  const smedsDispersion = interpolate(frame, [335, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Membrane contact glow intensity during SMEDS microdispersion
  const membranePulse = interpolate(frame, [360, 420, 460], [0, 0.9, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Intro fade up from black (0 - 18 frames)
  const introFade = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#020b12",
        opacity: introFade,
      }}
    >
      {/* Dynamic Aqueous Chamber environment */}
      <AqueousChamber
        cameraScale={cameraScale}
        cameraX={cameraX}
        cameraY={cameraY}
        accentScheme={isSmedsPhase ? "cyan-active" : "amber-muted"}
      >
        {/* Abstract biological absorption membrane on the right */}
        <AbsorptionMembrane pulseIntensity={membranePulse} />

        {/* Phase 1: Traditional Delivery System (Frames 0 - 200) */}
        {!isSmedsPhase && (
          <>
            <Softgel
              type="traditional"
              ruptureProgress={traditionalRupture}
              centerX={700}
              centerY={540}
              rotation={-8}
              scale={1.05}
            />
            <TraditionalDroplets
              releaseProgress={traditionalDropletRelease}
              originX={700}
              originY={540}
              opacity={traditionalDropletsOpacity}
            />
          </>
        )}

        {/* Phase 2: SMEDS Delivery System (Frames 205 - 540) */}
        {isSmedsPhase && (
          <>
            <Softgel
              type="smeds"
              ruptureProgress={smedsRupture}
              centerX={640}
              centerY={520}
              rotation={-14}
              scale={1.05}
            />
            <MicroDropletField
              activationProgress={smedsActivation}
              dispersionProgress={smedsDispersion}
              originX={640}
              originY={520}
              showReferenceDrop={frame < 320}
            />
          </>
        )}
      </AqueousChamber>

      {/* Full-Frame Droplet Pass Transition Overlay */}
      {transitionAmberCover > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 70,
            opacity: transitionAmberCover,
            background:
              "radial-gradient(circle at 45% 48%, rgba(254, 240, 138, 0.95) 0%, rgba(245, 158, 11, 0.95) 40%, rgba(180, 83, 9, 0.92) 80%, rgba(69, 26, 3, 0.98) 100%)",
            filter: `blur(${interpolate(transitionAmberCover, [0, 1], [0, 36])}px)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Scientific Overlay Labels */}
      {/* Shot 1: Traditional Softgel Label */}
      <ScientificLabel
        text="Traditional softgel"
        category="Standard Delivery"
        startFrame={10}
        durationFrames={80}
        accentColor="#f59e0b"
      />

      {/* Shot 3: Large Oil Droplets Label */}
      <ScientificLabel
        text="Large oil droplets"
        category="Dispersion Phase"
        startFrame={100}
        durationFrames={85}
        accentColor="#f59e0b"
      />

      {/* Shot 5: SMEDS Softgel Label */}
      <ScientificLabel
        text="SMEDS softgel"
        category="Micro-Emulsion Technology"
        startFrame={225}
        durationFrames={85}
        accentColor="#38bdf8"
      />

      {/* Shot 6: Microscopic Droplets Label */}
      <ScientificLabel
        text="Microscopic droplets"
        category="High Surface Area"
        startFrame={340}
        durationFrames={95}
        accentColor="#38bdf8"
      />

      {/* Shot 7: End Card */}
      <EndCard
        headline={project.endCard.headline}
        supportingLine={project.endCard.supportingLine}
        footnote={project.endCard.footnote}
        startFrame={460}
      />

      {/* Mandatory Claim Watermark & Scientific Disclaimer */}
      <DraftWatermark text={project.disclaimer} note={project.scientificNote} />

      {/* Burned-in High-Contrast Captions (Frames 0 - 460) */}
      {frame < 460 && (
        <div style={{position: "absolute", inset: 0, zIndex: 95, pointerEvents: "none"}}>
          <Caption cues={project.captions} />
        </div>
      )}
    </div>
  );
};
