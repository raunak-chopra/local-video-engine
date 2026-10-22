import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export type EndCardProps = {
  headline: string;
  supportingLine: string;
  footnote: string;
  startFrame: number;
};

export const EndCard: React.FC<EndCardProps> = ({
  headline,
  supportingLine,
  footnote,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: {damping: 18, stiffness: 90},
  });

  const fade = interpolate(relFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: `rgba(2, 11, 18, ${0.82 * fade})`,
        backdropFilter: `blur(${16 * fade}px)`,
        padding: "64px 120px",
        pointerEvents: "none",
      }}
    >
      {/* Category header */}
      <div
        style={{
          color: "#38bdf8",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 20,
          opacity: enter,
          transform: `translateY(${20 * (1 - enter)}px)`,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        Advanced Bioavailability Technology
      </div>

      {/* Main headline */}
      <div
        style={{
          color: "#f8fafc",
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: -1.8,
          textAlign: "center",
          maxWidth: 1300,
          lineHeight: 1.1,
          opacity: enter,
          transform: `translateY(${28 * (1 - enter)}px)`,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {headline}
      </div>

      {/* Supporting message placeholder */}
      <div
        style={{
          marginTop: 28,
          color: "#94a3b8",
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: -0.4,
          textAlign: "center",
          maxWidth: 960,
          opacity: interpolate(relFrame, [12, 32], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontStyle: "italic",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {supportingLine}
      </div>

      {/* Required substantiation footnote */}
      <div
        style={{
          position: "absolute",
          bottom: 74,
          left: 120,
          right: 120,
          textAlign: "center",
          color: "rgba(148, 163, 184, 0.6)",
          fontSize: 16,
          letterSpacing: 0.2,
          borderTop: "1px solid rgba(148, 163, 184, 0.15)",
          paddingTop: 18,
          opacity: interpolate(relFrame, [25, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {footnote}
      </div>
    </div>
  );
};
