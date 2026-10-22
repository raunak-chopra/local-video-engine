export type SmedsProjectStatus = "draft" | "claims-approved";

export type SmedsCues = {
  introMs: number;
  traditionalReleaseMs: number;
  separationMomentMs: number;
  transitionMs: number;
  smedsRuptureMs: number;
  microdropletsMs: number;
  widestDispersionMs: number;
  endCardMs: number;
};

export type CaptionCue = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type SmedsVideoProject = {
  id: string;
  status: SmedsProjectStatus;
  fps: 30;
  width: number;
  height: number;
  durationInFrames: number;
  narrationSrc: string;
  cues: SmedsCues;
  captions: CaptionCue[];
  disclaimer: string;
  scientificNote: string;
  endCard: {
    headline: string;
    supportingLine: string;
    footnote: string;
  };
};
