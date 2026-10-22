import React, {useEffect, useState} from "react";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/noto-sans-devanagari/wght.css";
import {AbsoluteFill, Sequence, cancelRender, continueRender, delayRender, type CalculateMetadataFunction} from "remotion";
import {Caption} from "../components/Caption";
import {mediaMapSchema, type MediaMap} from "./assets";
import {parseProject, type Project} from "./project-schema";
import {resolveTimeline, type ResolvedTimeline} from "./resolve-timeline";
import {renderScene} from "./scene-registry";
import {GraphicMotionProvider} from "./graphic-motion";

/**
 * Props accepted by the composition: raw project JSON, validated at render
 * time, plus (for v2) the prepared-media map the CLI builds from media.lock.json.
 */
export type ProjectCompositionProps = {
  project: unknown;
  media?: unknown;
};

/** Every v2 asset must have prepared media; v1 projects take none. */
const resolveMedia = (project: Project, media: unknown): MediaMap => {
  if (project.version === 1) {
    if (media !== undefined) throw new Error("v1 projects do not take media; use version 2 with an assets list.");
    return {};
  }
  const parsed = mediaMapSchema.safeParse(media ?? {});
  if (!parsed.success) throw new Error(`Invalid media props: ${parsed.error.issues[0]?.message}`);
  const missing = project.assets.filter((asset) => !(asset.id in parsed.data)).map((asset) => asset.id);
  if (missing.length > 0) throw new Error(`No prepared media for assets: ${missing.join(", ")}. Run: video prepare <project.json>`);
  return parsed.data;
};

/**
 * Bundled faces and a sample of the script each must cover. Fontsource splits
 * fonts by unicode-range, so the sample text selects the subset to load:
 * without Devanagari text only the Latin subset of Noto would be fetched.
 */
const BUNDLED_FONTS = [
  {family: "Inter Variable", sample: "Aa"},
  {family: "Noto Sans Devanagari Variable", sample: "क्षि"},
];

const LocalFontReady: React.FC = () => {
  const [handle] = useState(() => delayRender("Load bundled Inter and Noto Sans Devanagari"));
  useEffect(() => {
    Promise.all(BUNDLED_FONTS.flatMap(({family, sample}) =>
      [400, 650, 800, 900].map((weight) => document.fonts.load(`${weight} 48px "${family}"`, sample))))
      .then((fonts) => {
        if (fonts.some((loaded) => loaded.length === 0)) throw new Error("A bundled font failed to load");
        continueRender(handle);
      }).catch(cancelRender);
  }, [handle]);
  return null;
};

type ResolvedProps = ProjectCompositionProps & {
  resolved?: {project: Project; timeline: ResolvedTimeline; media: MediaMap};
};

/** Validates the project and derives size, fps and duration before any frame renders. */
export const calculateProjectMetadata: CalculateMetadataFunction<ResolvedProps> = ({props}) => {
  const project = parseProject(props.project);
  const media = resolveMedia(project, props.media);
  const timeline = resolveTimeline(project, project.version === 2 ? media : undefined);
  return {
    durationInFrames: timeline.durationInFrames,
    fps: timeline.fps,
    width: timeline.width,
    height: timeline.height,
    props: {...props, resolved: {project, timeline, media}},
  };
};

export const ProjectComposition: React.FC<ResolvedProps> = ({resolved}) => {
  if (!resolved) throw new Error("Project was not resolved; calculateMetadata did not run.");
  const {project, timeline, media} = resolved;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 18% 12%, ${project.brand.accent}22 0, ${project.brand.background} 55%)`,
        backgroundColor: project.brand.background,
      }}
    >
      <LocalFontReady />
      {timeline.scenes.map((resolvedScene) => (
        <Sequence key={resolvedScene.scene.id} from={resolvedScene.from} durationInFrames={resolvedScene.durationInFrames} name={resolvedScene.scene.id}>
          <GraphicMotionProvider value={resolvedScene.scene.type === "clip" ? undefined : resolvedScene.scene.motion}>
            {renderScene(resolvedScene, project.brand, media)}
          </GraphicMotionProvider>
        </Sequence>
      ))}
      <Caption cues={timeline.captions} fontFamily={project.brand.fontFamily} safe />
    </AbsoluteFill>
  );
};
