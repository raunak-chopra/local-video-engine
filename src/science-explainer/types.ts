export type WordCue = {
  word: string;
  startFrame: number;
  endFrame: number;
};

export type ScienceSceneCue = {
  id: string;
  title: string;
  subtitle: string;
  startFrame: number;
  durationInFrames: number;
};

export type ScienceProject = {
  id: string;
  title: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  scenes: ScienceSceneCue[];
  words: WordCue[];
};
