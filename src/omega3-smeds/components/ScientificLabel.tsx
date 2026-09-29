import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export type ScientificLabelProps = {
  text: string;
  category?: string;
  startFrame: number;
  durationFrames: number;
  top?: number | string;
  left?: number | string;
  accentColor?: string;
};

export const ScientificLabel: React.FC<ScientificLabelProps> = ({
  text,
  category,
  startFrame,
  durationFrames,
  top = 96,
  left = 96,
  accentColor = "#38bdf8",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > durationFrames) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: {damping: 18, stiffness: 120},
  });

  const exit = interpolate(
    relFrame,
    [durationFrames - 15, durationFrames],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const opacity = enter * exit;
  const translateY = interpolate(enter, [0, 1], [-12, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        zIndex: 80,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(10, 24, 38, 0.78)",
        border: `1px solid ${accentColor}44`,
        borderRadius: 12,
        padding: "10px 20px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 16px ${accentColor}22`,
        backdropFilter: "blur(12px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: accentColor,
          boxShadow: `0 0 10px ${accentColor}`,
        }}
      />
      <div>
        {category && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: accentColor,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            {category}
          </div>
        )}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: -0.3,
            color: "#f8fafc",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
