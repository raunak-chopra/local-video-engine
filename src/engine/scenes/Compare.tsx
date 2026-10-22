import React from "react";
import type {Project, SceneSpec} from "../project-schema";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

const Card: React.FC<{
  label: string;
  text: string;
  delay: number;
  highlight: boolean;
  brand: Project["brand"];
}> = ({label, text, delay, highlight, brand}) => {
  const u = useUnit();
  const p = useEnter(delay);
  return (
    <div
      style={{
        padding: 44 * u,
        borderRadius: 28 * u,
        border: `${3 * u}px solid ${highlight ? brand.accent : `${brand.foreground}33`}`,
        background: highlight ? `${brand.accent}1f` : `${brand.foreground}0a`,
        opacity: highlight ? p : p * 0.75,
        transform: `translateY(${50 * u * (1 - p)}px)`,
        marginBottom: 36 * u,
      }}
    >
      <div
        style={{
          fontSize: 28 * u,
          letterSpacing: 4 * u,
          textTransform: "uppercase",
          fontWeight: 800,
          color: highlight ? brand.accent : brand.foreground,
          opacity: highlight ? 1 : 0.6,
          marginBottom: 20 * u,
        }}
      >
        {label}
      </div>
      <div style={{fontSize: 46 * u, lineHeight: 1.3, fontWeight: highlight ? 700 : 400}}>{text}</div>
    </div>
  );
};

export const Compare: React.FC<SceneProps<Extract<SceneSpec, {type: "compare"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const head = useEnter();
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          fontSize: 78 * u,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -3 * u,
          marginBottom: 52 * u,
          opacity: head,
          transform: `translateY(${40 * u * (1 - head)}px)`,
        }}
      >
        {props.headline}
      </div>
      <Card {...props.left} delay={14} highlight={false} brand={brand} />
      <Card {...props.right} delay={26} highlight brand={brand} />
    </SceneFrame>
  );
};
