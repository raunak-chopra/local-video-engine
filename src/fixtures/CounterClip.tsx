import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";

/**
 * Synthetic source footage for media tests. Each frame shows its own number
 * and timestamp, so trims and cut points can be checked against decoded
 * frames; the red top-left block reveals rotation or mirroring.
 */
export const CounterClip: React.FC<{label: string}> = ({label}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const unit = Math.min(width, height) / 540;
  const hue = (frame * 3) % 360;
  return (
    <AbsoluteFill style={{background: `hsl(${hue}, 45%, 22%)`, color: "white", fontFamily: "Consolas, monospace", justifyContent: "center", alignItems: "center"}}>
      <div style={{position: "absolute", top: 0, left: 0, width: 120 * unit, height: 120 * unit, background: "#e5243b", fontSize: 40 * unit, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"}}>TL</div>
      <div style={{fontSize: 30 * unit, opacity: 0.8}}>{label}</div>
      <div style={{fontSize: 200 * unit, fontWeight: 700, lineHeight: 1}}>{frame}</div>
      <div style={{fontSize: 44 * unit}}>{(frame / fps).toFixed(3)} s</div>
      <div style={{fontSize: 24 * unit, opacity: 0.8}}>{width}x{height} @ {fps}</div>
    </AbsoluteFill>
  );
};
