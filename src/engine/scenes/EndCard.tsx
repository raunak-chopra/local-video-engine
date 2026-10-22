import React from "react";
import type {SceneSpec} from "../project-schema";
import {SceneFrame, useEnter, useUnit, type SceneProps} from "./shared";

export const EndCard: React.FC<SceneProps<Extract<SceneSpec, {type: "endCard"}>["props"]>> = ({
  props,
  brand,
  durationInFrames,
}) => {
  const u = useUnit();
  const title = useEnter(2);
  const cta = useEnter(14);
  return (
    <SceneFrame durationInFrames={durationInFrames} brand={brand}>
      <div
        style={{
          fontSize: 110 * u,
          fontWeight: 800,
          letterSpacing: -5 * u,
          lineHeight: 1,
          opacity: title,
          transform: `scale(${0.94 + 0.06 * title})`,
          transformOrigin: "left center",
        }}
      >
        {props.title}
      </div>
      {props.cta ? (
        <div
          style={{
            marginTop: 48 * u,
            alignSelf: "flex-start",
            padding: `${20 * u}px ${40 * u}px`,
            borderRadius: 999,
            background: brand.accent,
            color: brand.background,
            fontSize: 44 * u,
            fontWeight: 800,
            opacity: cta,
            transform: `translateY(${24 * u * (1 - cta)}px)`,
          }}
        >
          {props.cta}
        </div>
      ) : null}
      {props.url ? (
        <div style={{marginTop: 28 * u, fontSize: 34 * u, opacity: 0.75 * cta}}>
          {props.url}
        </div>
      ) : null}
    </SceneFrame>
  );
};
