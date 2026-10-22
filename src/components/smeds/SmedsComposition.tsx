import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Caption} from "../Caption";
import {CinematicOverlay} from "./CinematicOverlay";
import {FluidBackground} from "./FluidBackground";
import {SmedsVisualizer} from "./SmedsVisualizer";
import type {SmedsProjectConfig} from "../../video/types";

export type SmedsCompositionProps = {
  project: SmedsProjectConfig;
};

// Scene 1: Traditional Omega-3
const TraditionalScene: React.FC<{project: SmedsProjectConfig}> = ({project}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // Gentle fade-in at the beginning, fade-out into transition
  const opacity = interpolate(
    frame,
    [0, 15, 140, 156],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{opacity}}>
      <SmedsVisualizer
        scene="traditional"
        localFrame={frame}
        width={width}
        height={height}
        fps={fps}
        macroCount={project.simulation.macroDropletCount}
      />
      <CinematicOverlay scene="traditional" localFrame={frame} />
    </AbsoluteFill>
  );
};

// Scene 2: Cinematic Transition (Macro Plunge & Optical Flare)
const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // Optical flare / flash peak in the middle of transition
  const flareIntensity = interpolate(
    frame,
    [0, 28, 60],
    [0, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill>
      <SmedsVisualizer
        scene="transition"
        localFrame={frame}
        width={width}
        height={height}
        fps={fps}
      />

      {/* Optical Caustic Amber Light Flare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 75%)",
          opacity: flareIntensity,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      <CinematicOverlay scene="transition" localFrame={frame} />
    </AbsoluteFill>
  );
};

// Scene 3: SMEDS Micro-Emulsification
const SmedsScene: React.FC<{project: SmedsProjectConfig}> = ({project}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 15, 165, 180],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{opacity}}>
      <SmedsVisualizer
        scene="smeds"
        localFrame={frame}
        width={width}
        height={height}
        fps={fps}
        microCount={project.simulation.microDropletCount}
      />
      <CinematicOverlay scene="smeds" localFrame={frame} />
    </AbsoluteFill>
  );
};

// Scene 4: Hero Comparison Climax
const HeroComparisonScene: React.FC<{project: SmedsProjectConfig}> = ({project}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 15, 60, 75],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{opacity}}>
      <SmedsVisualizer
        scene="hero_comparison"
        localFrame={frame}
        width={width}
        height={height}
        fps={fps}
        sideBySide={true}
        microCount={project.simulation.microDropletCount}
      />

      {/* Subtle Chamber Divider for Comparison */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          bottom: "16%",
          left: "50%",
          width: 1,
          background:
            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.25) 70%, transparent)",
          boxShadow: "0 0 16px rgba(94, 234, 212, 0.4)",
          pointerEvents: "none",
        }}
      />

      <CinematicOverlay scene="hero_comparison" localFrame={frame} />
    </AbsoluteFill>
  );
};

export const SmedsComposition: React.FC<SmedsCompositionProps> = ({project}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Dynamic Stomach Fluid Background */}
      <FluidBackground frame={frame} />

      {/* Sequence 1: Traditional Omega-3 Softgel (0 - 5.2s) */}
      <Sequence
        from={project.scenes.traditional.startFrame}
        durationInFrames={
          project.scenes.traditional.endFrame -
          project.scenes.traditional.startFrame
        }
      >
        <TraditionalScene project={project} />
      </Sequence>

      {/* Sequence 2: Cinematic Transition (5.0s - 7.0s) */}
      <Sequence
        from={project.scenes.opticalTransition.startFrame}
        durationInFrames={
          project.scenes.opticalTransition.endFrame -
          project.scenes.opticalTransition.startFrame
        }
      >
        <TransitionScene />
      </Sequence>

      {/* Sequence 3: SMEDS Softgel & Micro-Emulsion (6.8s - 12.8s) */}
      <Sequence
        from={project.scenes.smeds.startFrame}
        durationInFrames={
          project.scenes.smeds.endFrame - project.scenes.smeds.startFrame
        }
      >
        <SmedsScene project={project} />
      </Sequence>

      {/* Sequence 4: Hero Comparison Climax (12.5s - 15.0s) */}
      <Sequence
        from={project.scenes.heroComparison.startFrame}
        durationInFrames={
          project.scenes.heroComparison.endFrame -
          project.scenes.heroComparison.startFrame
        }
      >
        <HeroComparisonScene project={project} />
      </Sequence>

      {/* Synchronized Voiceover Captions */}
      <Caption cues={project.captions} />
    </AbsoluteFill>
  );
};
