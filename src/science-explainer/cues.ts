import type {ScienceProject, WordCue} from "./types";

const scriptWords: {word: string; frame: number; dur: number}[] = [
  // Scene 1: 0 - 90
  {word: "Everything", frame: 15, dur: 12},
  {word: "in", frame: 28, dur: 6},
  {word: "the", frame: 35, dur: 6},
  {word: "universe", frame: 42, dur: 16},
  {word: "starts", frame: 59, dur: 10},
  {word: "here.", frame: 70, dur: 14},

  // Scene 2: 90 - 210
  {word: "An", frame: 95, dur: 6},
  {word: "ATOM", frame: 102, dur: 18},
  {word: "is", frame: 121, dur: 6},
  {word: "the", frame: 128, dur: 6},
  {word: "single", frame: 135, dur: 14},
  {word: "fundamental", frame: 150, dur: 20},
  {word: "building", frame: 171, dur: 14},
  {word: "block.", frame: 186, dur: 18},

  // Scene 3: 210 - 340
  {word: "One", frame: 215, dur: 8},
  {word: "type", frame: 224, dur: 10},
  {word: "is", frame: 235, dur: 6},
  {word: "an", frame: 242, dur: 6},
  {word: "ELEMENT.", frame: 249, dur: 20},
  {word: "When", frame: 275, dur: 8},
  {word: "atoms", frame: 284, dur: 12},
  {word: "BOND,", frame: 297, dur: 18},
  {word: "they", frame: 316, dur: 6},
  {word: "form", frame: 323, dur: 6},
  {word: "MOLECULES.", frame: 330, dur: 20},

  // Scene 4: 340 - 470
  {word: "Bond", frame: 348, dur: 10},
  {word: "different", frame: 359, dur: 16},
  {word: "elements,", frame: 376, dur: 18},
  {word: "and", frame: 395, dur: 6},
  {word: "you", frame: 402, dur: 6},
  {word: "have", frame: 409, dur: 8},
  {word: "a", frame: 418, dur: 6},
  {word: "COMPOUND.", frame: 425, dur: 24},

  // Scene 5: 470 - 600
  {word: "Mix", frame: 478, dur: 10},
  {word: "them", frame: 489, dur: 8},
  {word: "without", frame: 498, dur: 14},
  {word: "chemical", frame: 513, dur: 16},
  {word: "bonds,", frame: 530, dur: 16},
  {word: "and", frame: 547, dur: 6},
  {word: "that's", frame: 554, dur: 10},
  {word: "a", frame: 565, dur: 6},
  {word: "MIXTURE.", frame: 572, dur: 24},
];

export const scienceWords: WordCue[] = scriptWords.map((item) => ({
  word: item.word,
  startFrame: item.frame,
  endFrame: item.frame + item.dur,
}));

export const scienceProject: ScienceProject = {
  id: "science-explainer",
  title: "Atoms to Mixtures",
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 600,
  scenes: [
    {
      id: "intro",
      title: "FOUNDATIONAL CHEMISTRY",
      subtitle: "The Five Essential Building Blocks",
      startFrame: 0,
      durationInFrames: 90,
    },
    {
      id: "atom",
      title: "THE ATOM",
      subtitle: "Nucleus with orbiting electrons - the basic unit",
      startFrame: 90,
      durationInFrames: 120,
    },
    {
      id: "elements-molecules",
      title: "ELEMENTS & MOLECULES",
      subtitle: "Pure types versus bonded combinations",
      startFrame: 210,
      durationInFrames: 130,
    },
    {
      id: "compounds",
      title: "COMPOUNDS",
      subtitle: "Different elements chemically united",
      startFrame: 340,
      durationInFrames: 130,
    },
    {
      id: "mixtures",
      title: "MIXTURES",
      subtitle: "Physical combination without chemical bonds",
      startFrame: 470,
      durationInFrames: 130,
    },
  ],
  words: scienceWords,
};
