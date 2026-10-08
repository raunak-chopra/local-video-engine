import React from "react";
import type {Project, SceneSpec} from "./project-schema";
import {EndCard} from "./scenes/EndCard";
import {Hook} from "./scenes/Hook";
import {Statement} from "./scenes/Statement";

/**
 * Explicit scene registry. Project JSON only names a scene `type`; code for
 * each type lives in reviewed components, never in project data. The switch
 * is exhaustive, so adding a type to the schema fails type-checking until it
 * is registered here.
 */
export const renderScene = (
  scene: SceneSpec,
  brand: Project["brand"],
  durationInFrames: number,
): React.ReactElement => {
  switch (scene.type) {
    case "hook":
      return <Hook props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "statement":
      return <Statement props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "endCard":
      return <EndCard props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    default: {
      const unreachable: never = scene;
      throw new Error(`Unregistered scene type: ${JSON.stringify(unreachable)}`);
    }
  }
};
