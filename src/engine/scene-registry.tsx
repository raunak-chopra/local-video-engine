import React from "react";
import type {MediaMap} from "./assets";
import type {Project} from "./project-schema";
import type {ResolvedScene} from "./resolve-timeline";
import {Chart} from "./scenes/Chart";
import {Clip} from "./scenes/Clip";
import {Compare} from "./scenes/Compare";
import {EndCard} from "./scenes/EndCard";
import {Hook} from "./scenes/Hook";
import {List} from "./scenes/List";
import {Quote} from "./scenes/Quote";
import {Stat} from "./scenes/Stat";
import {Statement} from "./scenes/Statement";

/**
 * Explicit scene registry. Project JSON only names a scene `type`; code for
 * each type lives in reviewed components, never in project data. The switch
 * is exhaustive, so adding a type to the schema fails type-checking until it
 * is registered here.
 */
export const renderScene = (
  {scene, durationInFrames, trim}: ResolvedScene,
  brand: Project["brand"],
  media: MediaMap,
): React.ReactElement => {
  switch (scene.type) {
    case "clip": {
      const source = media[scene.asset];
      if (!source || !trim) throw new Error(`Clip "${scene.id}" has no prepared media or trim; run prepare.`);
      return <Clip scene={scene} media={source} trim={trim} />;
    }
    case "hook":
      return <Hook props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "statement":
      return <Statement props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "stat":
      return <Stat props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "list":
      return <List props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "compare":
      return <Compare props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "chart":
      return <Chart props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "quote":
      return <Quote props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    case "endCard":
      return <EndCard props={scene.props} brand={brand} durationInFrames={durationInFrames} />;
    default: {
      const unreachable: never = scene;
      throw new Error(`Unregistered scene type: ${JSON.stringify(unreachable)}`);
    }
  }
};
