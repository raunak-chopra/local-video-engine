import React from "react";
import {Composition} from "remotion";
import {VideoEngineDemo} from "./VideoEngineDemo";
import {demoProject} from "./video/project";
import {defaultSmedsProject} from "./video/smedsProject";
import {SmedsComposition} from "./components/smeds/SmedsComposition";
import {Omega3SmedsVideo} from "./omega3-smeds/Omega3SmedsComposition";
import {smedsProject} from "./omega3-smeds/project";
import {ScienceExplainerComposition} from "./science-explainer/ScienceExplainerComposition";
import {scienceProject} from "./science-explainer/cues";
import {ProjectComposition, calculateProjectMetadata} from "./engine/ProjectComposition";
import demoAdProject from "../projects/demo-ad/project.json";
import {CounterClip} from "./fixtures/CounterClip";

export const VideoEngineComposition: React.FC = () => (
  <>
    {/* Generic JSON-driven composition. Size, fps and duration come from the project. */}
    <Composition
      id="ProjectAd"
      component={ProjectComposition}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{project: demoAdProject as unknown}}
      calculateMetadata={calculateProjectMetadata}
    />

    {/* Synthetic counter footage for media tests (npm run fixtures). */}
    <Composition id="FixtureCounterPortrait" component={CounterClip} durationInFrames={120} fps={30} width={540} height={960} defaultProps={{label: "portrait source"}} />
    <Composition id="FixtureCounterLandscape" component={CounterClip} durationInFrames={120} fps={30} width={960} height={540} defaultProps={{label: "landscape source"}} />

    {/* 8th-Grade Educational Science Explainer (Option A - 20s / 600 frames) */}
    <Composition
      id="ScienceExplainer"
      component={ScienceExplainerComposition}
      durationInFrames={scienceProject.durationInFrames}
      fps={scienceProject.fps}
      width={scienceProject.width}
      height={scienceProject.height}
      defaultProps={{project: scienceProject}}
    />

    {/* Omega-3 SMEDS CGI Explainer (Master Specification - 18s / 540 frames) */}
    <Composition
      id="Omega3SmedsExplainer"
      component={Omega3SmedsVideo}
      durationInFrames={smedsProject.durationInFrames}
      fps={smedsProject.fps}
      width={smedsProject.width}
      height={smedsProject.height}
      defaultProps={{project: smedsProject}}
    />

    {/* SMEDS vs Traditional Omega-3 CGI Explainer (16:9 Landscape - Primary Hero) */}
    <Composition
      id="SmedsOmega3Explainer"
      component={SmedsComposition}
      durationInFrames={defaultSmedsProject.durationInFrames}
      fps={defaultSmedsProject.fps}
      width={defaultSmedsProject.width}
      height={defaultSmedsProject.height}
      defaultProps={{project: defaultSmedsProject}}
    />

    {/* SMEDS vs Traditional Omega-3 CGI Explainer (9:16 Portrait - Reels / Socials) */}
    <Composition
      id="SmedsOmega3Vertical"
      component={SmedsComposition}
      durationInFrames={defaultSmedsProject.durationInFrames}
      fps={defaultSmedsProject.fps}
      width={1080}
      height={1920}
      defaultProps={{
        project: {
          ...defaultSmedsProject,
          width: 1080,
          height: 1920,
        },
      }}
    />

    {/* Preserved foundational demo */}
    <Composition
      id="VideoEngineDemo"
      component={VideoEngineDemo}
      durationInFrames={demoProject.durationInFrames}
      fps={demoProject.fps}
      width={demoProject.width}
      height={demoProject.height}
      defaultProps={{project: demoProject}}
    />
  </>
);
