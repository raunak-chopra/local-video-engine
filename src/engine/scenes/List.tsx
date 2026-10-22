import React from "react";
import type {SceneSpec} from "../project-schema";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

const Item: React.FC<{text: string; delay: number; accent: string}> = ({text, delay, accent}) => {
  const u = useUnit();
  const p = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30 * u,
        marginBottom: 34 * u,
        opacity: p,
        transform: `translateX(${-60 * u * (1 - p)}px)`,
      }}
    >
      <div
        style={{flex: "none", width: 22 * u, height: 22 * u, borderRadius: "50%", background: accent, transform: `scale(${p})`}}
      />
      <div style={{fontSize: 52 * u, fontWeight: 600, lineHeight: 1.25}}>{text}</div>
    </div>
  );
};

export const List: React.FC<SceneProps<Extract<SceneSpec, {type: "list"}>["props"]>> = ({
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
          fontSize: 84 * u,
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
      {props.items.map((item, i) => (
        <Item key={item} text={item} delay={12 + i * 9} accent={brand.accent} />
      ))}
    </SceneFrame>
  );
};
