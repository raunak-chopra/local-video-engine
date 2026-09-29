export type CaptionCue = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type VideoProject = {
  id: string;
  title: string;
  subtitle: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  captions: CaptionCue[];
};

export type SmedsSceneType = "traditional" | "transition" | "smeds" | "hero_comparison";

export type SmedsSimulationConfig = {
  macroDropletCount: number;
  microDropletCount: number;
  macroBaseRadius: number;
  microBaseRadius: number;
  dispersionSpeed: number;
  surfaceTensionCohesion: number;
  brownianIntensity: number;
};

export type SmedsProjectConfig = {
  id: string;
  title: string;
  tagline: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  scenes: {
    traditional: {startFrame: number; endFrame: number};
    opticalTransition: {startFrame: number; endFrame: number};
    smeds: {startFrame: number; endFrame: number};
    heroComparison: {startFrame: number; endFrame: number};
  };
  captions: CaptionCue[];
  simulation: SmedsSimulationConfig;
};

