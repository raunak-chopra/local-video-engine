import React from "react";
import type {SceneSpec} from "../project-schema";
import {Eyebrow, SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

export const Statement: React.FC<
  SceneProps<Extract<SceneSpec, {type: "statement"}>["props"]>
> = ({props, brand, durationInFrames}) => {
  const u = useUnit();
  const enter = useEnter(4);
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <Eyebrow text={props.eyebrow} brand={brand} />
      <div
        style={{
          fontSize: 80 * u,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: -3 * u,
          opacity: enter,
          transform: `translateY(${40 * u * (1 - enter)}px)`,
        }}
      >
        {props.text}
      </div>
    </SceneFrame>
  );
};
