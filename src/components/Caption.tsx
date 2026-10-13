import {useCurrentFrame, useVideoConfig} from "remotion";
import {fadeOpacity} from "../engine/fade";
import type {ResolvedCaption} from "../engine/resolve-timeline";

export const Caption: React.FC<{cues: ResolvedCaption[]; fontFamily?: string; safe?: boolean}> = ({cues, fontFamily, safe = false}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const unit = Math.min(width, height) / 1080;
  const cue = cues.find(
    ({startFrame, endFrame}) => frame >= startFrame && frame < endFrame,
  );

  if (!cue) return null;

  const opacity = fadeOpacity(frame - cue.startFrame, cue.endFrame - cue.startFrame, 8);
  const vertical = height > width;
  const left = safe ? 64 * width / 1080 : width * 0.08;
  const right = safe ? (vertical ? 160 : 64) * width / 1080 : width * 0.08;

  return (
    <div
      style={{
        position: "absolute",
        bottom: safe ? (vertical ? 420 * height / 1920 : 64 * unit) : 72,
        left,
        right,
        width: "fit-content",
        maxWidth: width - left - right,
        margin: "0 auto",
        boxSizing: "border-box",
        overflowWrap: "anywhere",
        textAlign: "center",
        fontFamily,
        opacity,
        color: "#f8fbff",
        background: "rgba(5, 12, 24, 0.82)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 18,
        padding: "17px 30px",
        fontSize: (safe ? 44 : 34) * unit,
        fontWeight: 650,
        letterSpacing: -0.6,
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
      }}
    >
      {cue.text}
    </div>
  );
};
