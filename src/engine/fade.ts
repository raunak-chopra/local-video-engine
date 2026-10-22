import {interpolate} from "remotion";

/** Frame-local fade with no duplicate keyframes, including 1–16 frame spans. */
export const fadeOpacity = (frame: number, duration: number, maxFade: number): number => {
  if (duration <= 2) return 1;
  const fade = Math.min(maxFade, Math.floor((duration - 1) / 2));
  if (fade < 1) return 1;
  return interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
};

/** Independent scene edges; no fade means all content is visible at frame 0. */
export const graphicOpacity = (
  frame: number, duration: number, enter: "spring" | "cut", exit: "fade" | "cut",
): number => {
  if (enter === "spring" && exit === "fade") {
    return fadeOpacity(frame, duration, Math.min(10, Math.floor(duration / 4)));
  }
  const fade = Math.min(10, Math.floor((duration - 1) / 2));
  if (fade < 1) return 1;
  const start = enter === "cut" ? 1 : interpolate(frame, [0, fade], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const end = exit === "cut" ? 1 : interpolate(frame, [duration - fade, duration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return Math.min(start, end);
};
