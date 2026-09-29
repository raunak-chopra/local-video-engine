import type {SmedsVideoProject} from "./types";

export const smedsProject: SmedsVideoProject = {
  id: "Omega3SmedsExplainer",
  status: "draft",
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 540,
  narrationSrc: "audio/smeds-omega3-vo.wav",
  cues: {
    introMs: 0,
    traditionalReleaseMs: 1167, // Frame 35
    separationMomentMs: 2500,    // Frame 75
    transitionMs: 6167,          // Frame 185
    smedsRuptureMs: 7500,        // Frame 225
    microdropletsMs: 9500,       // Frame 285
    widestDispersionMs: 11167,   // Frame 335
    endCardMs: 15333,            // Frame 460
  },
  captions: [
    {
      startFrame: 10,
      endFrame: 175,
      text: "Most omega-3s don't fully blend in the body.",
    },
    {
      startFrame: 185,
      endFrame: 235,
      text: "Our new delivery system changes that.",
    },
    {
      startFrame: 240,
      endFrame: 350,
      text: "Instead of large oil drops, it forms microscopic droplets,",
    },
    {
      startFrame: 355,
      endFrame: 470,
      text: "making them far easier to absorb—even without a fatty meal.",
    },
  ],
  disclaimer: "DRAFT - CLAIMS UNVERIFIED",
  scientificNote: "Illustrative visualization - not to scale",
  endCard: {
    headline: "Self-Micro Emulsifying Delivery System",
    supportingLine: "[Approved product message to be supplied]",
    footnote: "[Required substantiation/footnote to be supplied]",
  },
};
