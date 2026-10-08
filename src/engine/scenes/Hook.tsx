import React from "react";
import type {SceneSpec} from "../project-schema";
import {Eyebrow, SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

export const Hook: React.FC<SceneProps<Extract<SceneSpec, {type: "hook"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const enter = useEnter(4);
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <Eyebrow text={props.eyebrow} brand={brand} />
      <div
        style={{
          fontSize: 124 * u,
          fontWeight: 800,
          lineHeight: 0.98,
          letterSpacing: -6 * u,
          opacity: enter,
          transform: `translateY(${60 * u * (1 - enter)}px)`,
        }}
      >
        {props.headline}
      </div>
    </SceneFrame>
  );
};
