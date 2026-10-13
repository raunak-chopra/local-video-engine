import React from "react";
import type {SceneSpec} from "../project-schema";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

export const Quote: React.FC<SceneProps<Extract<SceneSpec, {type: "quote"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const mark = useEnter();
  const text = useEnter(6);
  const who = useEnter(20);
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          fontSize: 260 * u,
          lineHeight: 0.6,
          height: 130 * u,
          color: brand.accent,
          fontFamily: "Georgia, serif",
          opacity: mark,
        }}
      >
        {"“"}
      </div>
      <div
        style={{
          fontSize: 72 * u,
          fontWeight: 700,
          lineHeight: 1.15,
          opacity: text,
          transform: `translateY(${40 * u * (1 - text)}px)`,
        }}
      >
        {props.quote}
      </div>
      {props.attribution ? (
        <div style={{marginTop: 40 * u, fontSize: 42 * u, color: brand.accent, opacity: who}}>
          {"— "}
          {props.attribution}
        </div>
      ) : null}
    </SceneFrame>
  );
};
