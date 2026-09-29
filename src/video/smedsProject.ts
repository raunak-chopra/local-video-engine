import type {SmedsProjectConfig} from "./types";

export const defaultSmedsProject: SmedsProjectConfig = {
  id: "smeds-cgi-explainer",
  title: "SMEDS vs. Traditional Omega-3",
  tagline: "Spontaneous Micro-Emulsification Technology",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 450, // 15.0 seconds @ 30 fps (adaptable 5s - 20s)
  scenes: {
    traditional: {
      startFrame: 0,
      endFrame: 156, // 0.0s - 5.2s
    },
    opticalTransition: {
      startFrame: 150,
      endFrame: 210, // 5.0s - 7.0s
    },
    smeds: {
      startFrame: 204,
      endFrame: 384, // 6.8s - 12.8s
    },
    heroComparison: {
      startFrame: 375,
      endFrame: 450, // 12.5s - 15.0s
    },
  },
  captions: [
    {
      startFrame: 15,
      endFrame: 140,
      text: "Most omega-3s don’t fully blend in the body.",
    },
    {
      startFrame: 155,
      endFrame: 210,
      text: "Our new delivery system changes that.",
    },
    {
      startFrame: 215,
      endFrame: 360,
      text: "Instead of large oil drops, it forms microscopic droplets...",
    },
    {
      startFrame: 365,
      endFrame: 440,
      text: "...making them far easier to absorb—even without a fatty meal.",
    },
  ],
  simulation: {
    macroDropletCount: 22,
    microDropletCount: 2400,
    macroBaseRadius: 36,
    microBaseRadius: 2.2,
    dispersionSpeed: 1.0,
    surfaceTensionCohesion: 0.85,
    brownianIntensity: 1.2,
  },
};
