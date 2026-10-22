import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {WordCue} from "../types";

export const WordCaption: React.FC<{words: WordCue[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Find active word
  const activeIndex = words.findIndex(
    (w) => frame >= w.startFrame && frame <= w.endFrame,
  );

  // If no word is currently active, find if we are in a small gap between words of the same group
  const recentWord = words.find(
    (w) => frame >= w.startFrame - 4 && frame <= w.endFrame + 12,
  );

  if (!recentWord && activeIndex === -1) {
    return null;
  }

  // Determine phrase window (display a rolling window of ~5 words)
  const pivot = activeIndex !== -1 ? activeIndex : words.indexOf(recentWord!);
  const startIndex = Math.max(0, pivot - 2);
  const visibleWords = words.slice(startIndex, startIndex + 5);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 72,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 32px",
        background: "rgba(7, 16, 28, 0.88)",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.16)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        zIndex: 50,
      }}
    >
      {visibleWords.map((w) => {
        const isCurrent = frame >= w.startFrame && frame <= w.endFrame;
        const hasPassed = frame > w.endFrame;

        const pop = isCurrent
          ? spring({
              frame: frame - w.startFrame,
              fps,
              config: {damping: 12, stiffness: 220},
            })
          : 0;

        const scale = isCurrent ? 1 + pop * 0.12 : 1;
        const color = isCurrent
          ? "#58e6d9" // Cyan accent
          : hasPassed
            ? "#ffffff"
            : "rgba(255, 255, 255, 0.45)";

        return (
          <span
            key={`${w.word}-${w.startFrame}`}
            style={{
              fontSize: 34,
              fontWeight: isCurrent ? 800 : 650,
              color,
              transform: `scale(${scale})`,
              letterSpacing: -0.5,
              textShadow: isCurrent ? "0 0 20px rgba(88, 230, 217, 0.6)" : "none",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};
