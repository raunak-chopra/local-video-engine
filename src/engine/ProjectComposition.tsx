import React, {useEffect, useState} from "react";
import "@fontsource-variable/inter/wght.css";
import {AbsoluteFill, Sequence, cancelRender, continueRender, delayRender, type CalculateMetadataFunction} from "remotion";
import {Caption} from "../components/Caption";
import {parseProject, type Project} from "./project-schema";
import {resolveTimeline, type ResolvedTimeline} from "./resolve-timeline";
import {renderScene} from "./scene-registry";

/** Props accepted by the composition: raw project JSON, validated at render time. */
export type ProjectCompositionProps = {
  project: unknown;
};

const LocalFontReady: React.FC = () => {
  const [handle] = useState(() => delayRender("Load bundled Inter Variable"));
  useEffect(() => {
    Promise.all([400, 650, 800, 900].map((weight) => document.fonts.load(`${weight} 48px "Inter Variable"`)))
      .then((fonts) => {
        if (fonts.some((loaded) => loaded.length === 0)) throw new Error("Bundled Inter Variable failed to load");
        continueRender(handle);
      }).catch(cancelRender);
  }, [handle]);
  return null;
};

type ResolvedProps = ProjectCompositionProps & {
  resolved?: {project: Project; timeline: ResolvedTimeline};
};

/** Validates the project and derives size, fps and duration before any frame renders. */
export const calculateProjectMetadata: CalculateMetadataFunction<ResolvedProps> = ({props}) => {
  const project = parseProject(props.project);
  const timeline = resolveTimeline(project);
  return {
    durationInFrames: timeline.durationInFrames,
    fps: timeline.fps,
    width: timeline.width,
    height: timeline.height,
    props: {...props, resolved: {project, timeline}},
  };
};

export const ProjectComposition: React.FC<ResolvedProps> = ({resolved}) => {
  if (!resolved) throw new Error("Project was not resolved; calculateMetadata did not run.");
  const {project, timeline} = resolved;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 18% 12%, ${project.brand.accent}22 0, ${project.brand.background} 55%)`,
        backgroundColor: project.brand.background,
      }}
    >
      <LocalFontReady />
      {timeline.scenes.map(({scene, from, durationInFrames}) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={scene.id}>
          {renderScene(scene, project.brand, durationInFrames)}
        </Sequence>
      ))}
      <Caption cues={timeline.captions} fontFamily={project.brand.fontFamily} safe />
    </AbsoluteFill>
  );
};
