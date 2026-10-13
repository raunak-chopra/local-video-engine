import React from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {fadeOpacity} from "../fade";
import type {Project} from "../project-schema";

export const SAFE_AREA = 64;

export type SceneProps<P> = {
  props: P;
  brand: Project["brand"];
  durationInFrames: number;
};

/** Size unit that keeps type proportional across 9:16, 1:1 and 16:9. */
export const useUnit = () => {
  const {width, height} = useVideoConfig();
  return Math.min(width, height) / 1080;
};

/** Fades a scene in and out using only the current frame. */
export const SceneFrame: React.FC<
  React.PropsWithChildren<{durationInFrames: number; brand: Project["brand"]}>
> = ({children, durationInFrames, brand}) => {
  const frame = useCurrentFrame();
  const opacity = fadeOpacity(frame, durationInFrames, Math.min(10, Math.floor(durationInFrames / 4)));
  return (
    <AbsoluteFill
      style={{
        opacity,
        padding: SAFE_AREA * 1.5,
        justifyContent: "center",
        color: brand.foreground,
        fontFamily: brand.fontFamily,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 16, stiffness: 95}});
};

export const Eyebrow: React.FC<{text?: string; brand: Project["brand"]}> = ({text, brand}) => {
  const u = useUnit();
  const enter = useEnter();
  if (!text) return null;
  return (
    <div
      style={{
        color: brand.accent,
        fontSize: 30 * u,
        fontWeight: 800,
        letterSpacing: 6 * u,
        textTransform: "uppercase",
        opacity: enter,
        marginBottom: 28 * u,
      }}
    >
      {text}
    </div>
  );
};
