import {interpolate, useCurrentFrame} from "remotion";
import type {CaptionCue} from "../video/types";

export const Caption: React.FC<{cues: CaptionCue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const cue = cues.find(
    ({startFrame, endFrame}) => frame >= startFrame && frame < endFrame,
  );

  if (!cue) return null;

  const opacity = interpolate(
    frame,
    [cue.startFrame, cue.startFrame + 8, cue.endFrame - 8, cue.endFrame],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 72,
        left: "50%",
        transform: "translateX(-50%)",
        opacity,
        color: "#f8fbff",
        background: "rgba(5, 12, 24, 0.82)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 18,
        padding: "17px 30px",
        fontSize: 34,
        fontWeight: 650,
        letterSpacing: -0.6,
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
      }}
    >
      {cue.text}
    </div>
  );
};
