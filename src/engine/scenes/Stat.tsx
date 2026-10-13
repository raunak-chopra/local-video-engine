import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import type {SceneSpec} from "../project-schema";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

/** Parses "$1,250+" into prefix, number and suffix so the number can count up. */
export const countUp = (value: string, progress: number): string => {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return value;
  const [, prefix, raw, suffix] = match;
  const target = Number(raw.replace(/,/g, ""));
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const current = target * progress;
  const text = raw.includes(",")
    ? current.toLocaleString("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals})
    : current.toFixed(decimals);
  return `${prefix}${text}${suffix}`;
};

export const Stat: React.FC<SceneProps<Extract<SceneSpec, {type: "stat"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = useEnter();
  const label = useEnter(10);
  const progress = interpolate(frame, [0, fps * 1.4], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          color: brand.accent,
          fontSize: 230 * u,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: -6 * u,
          fontVariantNumeric: "tabular-nums",
          transform: `scale(${0.9 + 0.1 * enter})`,
          transformOrigin: "left bottom",
        }}
      >
        {countUp(props.value, progress)}
      </div>
      <div
        style={{
          marginTop: 30 * u,
          fontSize: 72 * u,
          fontWeight: 800,
          lineHeight: 1.05,
          opacity: label,
          transform: `translateY(${30 * u * (1 - label)}px)`,
        }}
      >
        {props.label}
      </div>
      {props.detail ? (
        <div style={{marginTop: 28 * u, fontSize: 42 * u, opacity: 0.8 * label}}>{props.detail}</div>
      ) : null}
    </SceneFrame>
  );
};
