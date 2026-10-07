const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const color = /^#[0-9a-fA-F]{6}$/;
const publicPath = (ext) => new RegExp(`^[a-zA-Z0-9_-][a-zA-Z0-9_./-]*\\.(${ext})$`, 'i');
const imagePath = publicPath('png|jpg|jpeg|webp|svg');
const audioPath = publicPath('mp3|wav|m4a');
const allowedKinds = new Set(['title', 'point', 'stat', 'list', 'quote', 'compare', 'chart', 'image', 'outro']);
const transitions = new Set(['fade', 'slide', 'wipe', 'none']);
const fonts = new Set(['Inter', 'Space Grotesk', 'Poppins', 'Montserrat', 'Playfair Display']);
const text = (value, max) => typeof value === 'string' && value.trim() !== '' && value.length <= max;
const safePath = (value, pattern) => typeof value === 'string' && pattern.test(value) && !value.split('/').includes('..');

/** Every path under public/ referenced by the brief (for existence checks at render time). */
export const assetPaths = (brief) => [
  brief.audio,
  brief.brand?.logo,
  ...(Array.isArray(brief.scenes) ? brief.scenes.map((scene) => scene?.kind === 'image' ? scene.src : undefined) : []),
].filter((path) => typeof path === 'string');

function validateScene(scene, where, errors) {
  if (!isObject(scene)) { errors.push(`${where} must be an object.`); return; }
  if (!allowedKinds.has(scene.kind)) errors.push(`${where}.kind must be one of: ${[...allowedKinds].join(', ')}.`);
  if (!text(scene.headline, 90)) errors.push(`${where}.headline must be 1–90 characters.`);
  if (scene.detail !== undefined && (typeof scene.detail !== 'string' || scene.detail.length > 180)) errors.push(`${where}.detail must be at most 180 characters.`);
  if (typeof scene.duration !== 'number' || !Number.isFinite(scene.duration) || scene.duration < 1 || scene.duration > 15) errors.push(`${where}.duration must be 1–15 seconds.`);
  if (scene.transition !== undefined && !transitions.has(scene.transition)) errors.push(`${where}.transition must be fade, slide, wipe, or none.`);
  switch (scene.kind) {
    case 'stat':
      if (!text(scene.value, 20)) errors.push(`${where}.value must be 1–20 characters for a stat scene.`);
      break;
    case 'list':
      if (!Array.isArray(scene.items) || scene.items.length < 2 || scene.items.length > 5 || !scene.items.every((item) => text(item, 60))) errors.push(`${where}.items must be 2–5 strings of 1–60 characters.`);
      break;
    case 'compare':
      for (const side of ['left', 'right']) {
        if (!isObject(scene[side]) || !text(scene[side].label, 24) || !text(scene[side].text, 90)) errors.push(`${where}.${side} needs label (1–24 chars) and text (1–90 chars).`);
      }
      break;
    case 'chart':
      if (!Array.isArray(scene.bars) || scene.bars.length < 2 || scene.bars.length > 6 || !scene.bars.every((bar) => isObject(bar) && text(bar.label, 30) && typeof bar.value === 'number' && Number.isFinite(bar.value) && bar.value >= 0)) errors.push(`${where}.bars must be 2–6 items with label (1–30 chars) and a non-negative value.`);
      else if (!scene.bars.some((bar) => bar.value > 0)) errors.push(`${where}.bars needs at least one value above 0.`);
      if (scene.unit !== undefined && (typeof scene.unit !== 'string' || scene.unit.length > 6)) errors.push(`${where}.unit must be at most 6 characters.`);
      break;
    case 'image':
      if (!safePath(scene.src, imagePath)) errors.push(`${where}.src must be a relative image path inside public/.`);
      break;
  }
}

export function validateBrief(brief) {
  const errors = [];
  if (!isObject(brief)) return ['Brief must be a JSON object.'];
  if (!['portrait', 'landscape'].includes(brief.format)) errors.push('format must be portrait or landscape.');
  if (brief.fps !== 30) errors.push('fps must be 30.');
  if (!isObject(brief.brand)) {
    errors.push('brand must be an object.');
  } else {
    const brand = brief.brand;
    if (!text(brand.name, 40)) errors.push('brand.name must be 1–40 characters.');
    for (const key of ['background', 'foreground', 'accent']) {
      if (typeof brand[key] !== 'string' || !color.test(brand[key])) errors.push(`brand.${key} must be a six-digit hex color.`);
    }
    if (brand.secondary !== undefined && (typeof brand.secondary !== 'string' || !color.test(brand.secondary))) errors.push('brand.secondary must be a six-digit hex color.');
    if (brand.font !== undefined && !fonts.has(brand.font)) errors.push(`brand.font must be one of: ${[...fonts].join(', ')}.`);
    if (brand.motion !== undefined && !['calm', 'punchy'].includes(brand.motion)) errors.push('brand.motion must be calm or punchy.');
    if (brand.logo !== undefined && !safePath(brand.logo, imagePath)) errors.push('brand.logo must be a relative image path inside public/.');
  }
  if (!Array.isArray(brief.scenes) || brief.scenes.length < 1 || brief.scenes.length > 12) {
    errors.push('scenes must contain 1–12 scenes.');
  } else {
    brief.scenes.forEach((scene, i) => validateScene(scene, `scenes[${i}]`, errors));
    const seconds = brief.scenes.reduce((sum, scene) => sum + (typeof scene?.duration === 'number' ? scene.duration : 0), 0);
    if (seconds > 120) errors.push('Total video duration must be at most 120 seconds.');
  }
  if (brief.audio !== undefined && !safePath(brief.audio, audioPath)) {
    errors.push('audio must be a relative .mp3, .wav, or .m4a path inside public/.');
  }
  return errors;
}
