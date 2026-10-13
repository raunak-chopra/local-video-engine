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
