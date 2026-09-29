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

export const VideoEngineComposition: React.FC = () => (
  <>
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
