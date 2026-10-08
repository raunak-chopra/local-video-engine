import React from "react";
import {AbsoluteFill, Sequence, type CalculateMetadataFunction} from "remotion";
import {Caption} from "../components/Caption";
import {parseProject, type Project} from "./project-schema";
import {resolveTimeline, type ResolvedTimeline} from "./resolve-timeline";
import {renderScene} from "./scene-registry";

/** Props accepted by the composition: raw project JSON, validated at render time. */
export type ProjectCompositionProps = {
  project: unknown;
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
      {timeline.scenes.map(({scene, from, durationInFrames}) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={scene.id}>
          {renderScene(scene, project.brand, durationInFrames)}
        </Sequence>
      ))}
      <Caption cues={timeline.captions} />
    </AbsoluteFill>
  );
};
