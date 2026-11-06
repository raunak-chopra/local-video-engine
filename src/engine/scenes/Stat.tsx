import React, {useEffect, useState} from "react";
import {cancelRender, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import type {SceneSpec} from "../project-schema";
import {useGraphicMotion} from "../graphic-motion";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

/** Keep a metric on one line without losing digits. Refuse unreadable fitting. */
export const fitStatSize = (measuredWidth: number, preferredSize: number, availableWidth: number, minimumSize: number) => {
  const size = Math.min(preferredSize, preferredSize * availableWidth / Math.max(measuredWidth, 1));
  if (size < minimumSize) throw new Error("Stat value cannot fit at a readable size. Use a different layout or an approved shorter value.");
  return size;
};

const useStatSize = (value: string, family: string, preferredSize: number, availableWidth: number, minimumSize: number) => {
  const [handle] = useState(() => delayRender("Measure complete stat value after font loading"));
  const [size, setSize] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    document.fonts.load(`800 ${preferredSize}px ${family}`, value).then(() => {
      if (!active) return;
      const context = document.createElement("canvas").getContext("2d");
      if (!context) throw new Error("Cannot measure stat text.");
      context.font = `800 ${preferredSize}px ${family}`;
      // The picture uses tabular numerals. Reserve the widest digit rather than
      // measuring proportional 1s and accidentally underestimating their width.
      const digit = [..."0123456789"].sort((a, b) => context.measureText(b).width - context.measureText(a).width)[0];
      const measured = context.measureText(value.replace(/\d/g, digit)).width;
      // Ignore the negative tracking when fitting, leaving additional clearance.
      setSize(fitStatSize(measured, preferredSize, availableWidth, minimumSize));
    }).catch(cancelRender);
    return () => { active = false; };
  }, [value, family, preferredSize, availableWidth, minimumSize]);
  useEffect(() => { if (size !== null) continueRender(handle); }, [size, handle]);
  return size ?? preferredSize;
};

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
  const {fps, width} = useVideoConfig();
  const valueSize = useStatSize(props.value, brand.fontFamily, 230 * u, width - 192, 64 * u);
  const enter = useEnter();
  const label = useEnter(10);
  const motion = useGraphicMotion();
  const progress = motion?.enter === "cut" ? 1 : interpolate(frame, [0, fps * 1.4], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          color: brand.accent,
          fontSize: valueSize,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: -6 * valueSize / 230,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
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
