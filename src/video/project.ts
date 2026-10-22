import type {VideoProject} from "./types";

export const demoProject: VideoProject = {
  id: "video-engine-demo",
  title: "Ideas become motion.",
  subtitle: "A personal, code-driven video engine",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 540,
  captions: [
    {startFrame: 18, endFrame: 132, text: "Start with one clear idea."},
    {
      startFrame: 162,
      endFrame: 342,
      text: "Turn the script into timed, reusable scenes.",
    },
    {
      startFrame: 372,
      endFrame: 516,
      text: "Create with Antigravity, Codex and Claude Code.",
    },
  ],
};
