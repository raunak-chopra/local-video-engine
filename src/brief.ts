export type Transition = 'fade' | 'slide' | 'wipe' | 'none';
export type FontName = 'Inter' | 'Space Grotesk' | 'Poppins' | 'Montserrat' | 'Playfair Display';

type SceneBase = {
  headline: string;
  detail?: string;
  duration: number;
  /** Transition into the next scene. Defaults to fade. */
  transition?: Transition;
};

export type Scene =
  | (SceneBase & {kind: 'title' | 'point' | 'quote' | 'outro'})
  | (SceneBase & {kind: 'stat'; value: string})
  | (SceneBase & {kind: 'list'; items: string[]})
  | (SceneBase & {kind: 'compare'; left: {label: string; text: string}; right: {label: string; text: string}})
  | (SceneBase & {kind: 'chart'; bars: {label: string; value: number}[]; unit?: string})
  | (SceneBase & {kind: 'image'; src: string});

export type Brand = {
  name: string;
  background: string;
  foreground: string;
  accent: string;
  secondary?: string;
  font?: FontName;
  logo?: string;
  motion?: 'calm' | 'punchy';
};

export type Brief = {
  format: 'portrait' | 'landscape';
  fps: 30;
  brand: Brand;
  scenes: Scene[];
  audio?: string;
};

export const transitionFrames = (brief: Brief): number => (brief.brand.motion === 'punchy' ? 10 : 18);

/** Frames each transition overlaps; the last scene has no outgoing transition. */
export const overlaps = (brief: Brief) =>
  brief.scenes.map((scene, i) => (i < brief.scenes.length - 1 && scene.transition !== 'none' ? transitionFrames(brief) : 0));

export const sceneFrames = (brief: Brief, scene: Scene) => Math.round(scene.duration * brief.fps);

export const totalFrames = (brief: Brief) =>
  brief.scenes.reduce((sum, scene) => sum + sceneFrames(brief, scene), 0) - overlaps(brief).reduce((a, b) => a + b, 0);
