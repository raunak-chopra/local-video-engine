/** Convert milliseconds to frames at 30 fps. */
export const msToFrame = (ms: number, fps = 30): number =>
  Math.round((ms / 1000) * fps);

/** Convert frame number to milliseconds at 30 fps. */
export const frameToMs = (frame: number, fps = 30): number =>
  (frame / fps) * 1000;
