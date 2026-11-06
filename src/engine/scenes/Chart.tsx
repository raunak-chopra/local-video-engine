import React from "react";
import {useVideoConfig} from "remotion";
import type {SceneSpec} from "../project-schema";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

const Bar: React.FC<{
  label: string;
  value: number;
  unit: string;
  share: number;
  highlight: boolean;
  delay: number;
  accent: string;
  foreground: string;
  dense: boolean;
}> = ({label, value, unit, share, highlight, delay, accent, foreground, dense}) => {
  const u = useUnit();
  const p = Math.min(1, useEnter(delay));
  return (
    <div style={{marginBottom: (dense ? 16 : 34) * u}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: (dense ? 34 : 36) * u,
          marginBottom: (dense ? 10 : 12) * u,
          opacity: Math.min(1, p * 1.5),
        }}
      >
        <span style={{opacity: 0.8}}>{label}</span>
        <span style={{fontWeight: 800, fontVariantNumeric: "tabular-nums", color: highlight ? accent : undefined}}>
          {chartDisplayValue(value, p)}
          {unit}
        </span>
      </div>
      <div style={{height: (dense ? 28 : 36) * u, borderRadius: 10 * u, background: `${foreground}14`}}>
        <div
          style={{
            height: "100%",
            width: `${share * 100 * p}%`,
            borderRadius: 10 * u,
            background: highlight ? accent : `${foreground}66`,
          }}
        />
      </div>
    </div>
  );
};

/** Preserve source precision as springs approach their target from either side. */
export const chartDisplayValue = (value: number, progress: number): number => {
  if (progress >= 1) return value;
  const [coefficient, exponent = "0"] = value.toString().split("e");
  const decimals = Math.max(0, (coefficient.split(".")[1]?.length ?? 0) - Number(exponent));
  if (decimals <= 100) return Number((value * progress).toFixed(decimals));
  // toFixed is limited to 100 places; preserve very small scientific values too.
  const significant = coefficient.replace(".", "").replace(/^0+/, "").length;
  return Number((value * progress).toPrecision(significant));
};

export const Chart: React.FC<SceneProps<Extract<SceneSpec, {type: "chart"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const {width, height} = useVideoConfig();
  const dense = width === height && props.bars.length >= 5;
  const head = useEnter();
  const max = Math.max(...props.bars.map((b) => b.value), 1);
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          fontSize: (dense ? 64 : 78) * u,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -3 * u,
          marginBottom: (dense ? 28 : 56) * u,
          opacity: head,
          transform: `translateY(${40 * u * (1 - head)}px)`,
        }}
      >
        {props.headline}
      </div>
      {props.bars.map((bar, i) => (
        <Bar
          key={bar.label}
          {...bar}
          unit={props.unit}
          share={bar.value / max}
          highlight={bar.value === max}
          delay={12 + i * 6}
          accent={brand.accent}
          foreground={brand.foreground}
          dense={dense}
        />
      ))}
      {props.source ? <div style={{fontSize: 30 * u, opacity: 0.6, marginTop: 12 * u}}>{props.source}</div> : null}
    </SceneFrame>
  );
};
