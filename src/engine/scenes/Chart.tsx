import React from "react";
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
}> = ({label, value, unit, share, highlight, delay, accent, foreground}) => {
  const u = useUnit();
  const p = Math.min(1, useEnter(delay));
  return (
    <div style={{marginBottom: 34 * u}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 36 * u,
          marginBottom: 12 * u,
          opacity: Math.min(1, p * 1.5),
        }}
      >
        <span style={{opacity: 0.8}}>{label}</span>
        <span style={{fontWeight: 800, fontVariantNumeric: "tabular-nums", color: highlight ? accent : undefined}}>
          {Math.round(value * p)}
          {unit}
        </span>
      </div>
      <div style={{height: 36 * u, borderRadius: 10 * u, background: `${foreground}14`}}>
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

export const Chart: React.FC<SceneProps<Extract<SceneSpec, {type: "chart"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const head = useEnter();
  const max = Math.max(...props.bars.map((b) => b.value), 1);
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          fontSize: 78 * u,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -3 * u,
          marginBottom: 56 * u,
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
        />
      ))}
      {props.source ? <div style={{fontSize: 30 * u, opacity: 0.6, marginTop: 12 * u}}>{props.source}</div> : null}
    </SceneFrame>
  );
};
