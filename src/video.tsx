import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import type {TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {loadFont as spaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as poppins} from '@remotion/google-fonts/Poppins';
import {loadFont as montserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as playfair} from '@remotion/google-fonts/PlayfairDisplay';
import type {Brief, FontName, Scene as SceneData, Transition} from './brief';
import {overlaps, sceneFrames, totalFrames, transitionFrames} from './brief';

const fontLoaders: Record<FontName, () => {fontFamily: string}> = {
  Inter: () => inter('normal', {weights: ['400', '700', '800'], subsets: ['latin']}),
  'Space Grotesk': () => spaceGrotesk('normal', {weights: ['400', '700'], subsets: ['latin']}),
  Poppins: () => poppins('normal', {weights: ['400', '700', '800'], subsets: ['latin']}),
  Montserrat: () => montserrat('normal', {weights: ['400', '700', '800'], subsets: ['latin']}),
  'Playfair Display': () => playfair('normal', {weights: ['400', '700', '800'], subsets: ['latin']}),
};
const loaded = new Map<FontName, string>();
const fontFamily = (name: FontName = 'Inter') => {
  if (!loaded.has(name)) loaded.set(name, fontLoaders[name]().fontFamily);
  return `${loaded.get(name)}, Arial, sans-serif`;
};

type Ctx = {brief: Brief; unit: number; landscape: boolean; punchy: boolean; accent: string; secondary: string};

/** Spring that starts after `delay` frames; punchy motion overshoots slightly. */
const useEnter = (ctx: Ctx, delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: ctx.punchy ? {damping: 14, stiffness: 160} : {damping: 200, stiffness: 90}});
};

const Words = ({text, ctx, delay = 0, style}: {text: string; ctx: Ctx; delay?: number; style: CSSProperties}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stagger = ctx.punchy ? 2 : 3;
  return (
    <h1 style={{margin: 0, ...style}}>
      {text.split(/\s+/).map((word, i) => {
        const p = spring({frame: frame - delay - i * stagger, fps, config: ctx.punchy ? {damping: 14, stiffness: 160} : {damping: 200, stiffness: 100}});
        return (
          <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 0.6}em)`}}>
            {word}{' '}
          </span>
        );
      })}
    </h1>
  );
};

const Detail = ({text, ctx, delay, style}: {text?: string; ctx: Ctx; delay: number; style?: CSSProperties}) => {
  const p = useEnter(ctx, delay);
  if (!text) return null;
  return <p style={{fontSize: `${(ctx.landscape ? 42 : 45) * ctx.unit}px`, lineHeight: 1.35, marginTop: `${40 * ctx.unit}px`, marginBottom: 0, opacity: p * 0.82, transform: `translateY(${(1 - p) * 30 * ctx.unit}px)`, ...style}}>{text}</p>;
};

const AccentBar = ({ctx, delay = 0}: {ctx: Ctx; delay?: number}) => {
  const p = useEnter(ctx, delay);
  return <div style={{height: `${8 * ctx.unit}px`, width: `${110 * ctx.unit * p}px`, background: ctx.accent, marginBottom: `${50 * ctx.unit}px`}} />;
};

const headlineStyle = (ctx: Ctx, size = 1): CSSProperties => ({
  fontSize: `${(ctx.landscape ? 100 : 108) * size * ctx.unit}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: `${-1.5 * ctx.unit}px`, overflowWrap: 'anywhere',
});

/** Parses "$1,250+" into prefix, number, suffix so the number can count up. */
const countUp = (value: string, progress: number) => {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return value;
  const [, prefix, raw, suffix] = match;
  const target = Number(raw.replace(/,/g, ''));
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  const current = (target * progress).toFixed(decimals);
  const formatted = raw.includes(',') ? Number(current).toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals}) : current;
  return `${prefix}${formatted}${suffix}`;
};

const Content = ({scene, ctx}: {scene: SceneData; ctx: Ctx}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {unit, landscape} = ctx;
  const wordsIn = scene.headline.split(/\s+/).length * (ctx.punchy ? 2 : 3);

  switch (scene.kind) {
    case 'title':
      return (
        <Block ctx={ctx} top={landscape ? '26%' : '32%'}>
          <AccentBar ctx={ctx} />
          <Words text={scene.headline} ctx={ctx} style={{...headlineStyle(ctx, 1.12), maxWidth: landscape ? '80%' : '100%'}} />
          <Detail text={scene.detail} ctx={ctx} delay={wordsIn + 6} style={{maxWidth: landscape ? '62%' : '100%'}} />
        </Block>
      );
    case 'point':
      return (
        <Block ctx={ctx} top={landscape ? '24%' : '30%'}>
          <AccentBar ctx={ctx} />
          <Words text={scene.headline} ctx={ctx} style={{...headlineStyle(ctx), maxWidth: landscape ? '72%' : '100%'}} />
          <Detail text={scene.detail} ctx={ctx} delay={wordsIn + 6} style={{maxWidth: landscape ? '62%' : '100%'}} />
        </Block>
      );
    case 'stat': {
      const p = interpolate(frame, [0, fps * 1.4], [0, 1], {extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
      return (
        <Block ctx={ctx} top={landscape ? '20%' : '27%'}>
          <div style={{fontWeight: 800, color: ctx.accent, fontSize: `${(landscape ? 210 : 230) * unit}px`, lineHeight: 1, letterSpacing: `${-6 * unit}px`, fontVariantNumeric: 'tabular-nums', transform: `scale(${0.9 + 0.1 * useEnter(ctx)})`, transformOrigin: 'left bottom'}}>
            {countUp(scene.value, p)}
          </div>
          <div style={{marginTop: `${30 * unit}px`}}><Words text={scene.headline} ctx={ctx} delay={10} style={headlineStyle(ctx, 0.72)} /></div>
          <Detail text={scene.detail} ctx={ctx} delay={20 + wordsIn} style={{maxWidth: landscape ? '62%' : '100%'}} />
        </Block>
      );
    }
    case 'list':
      return (
        <Block ctx={ctx} top={landscape ? '16%' : '22%'}>
          <Words text={scene.headline} ctx={ctx} style={{...headlineStyle(ctx, 0.8), marginBottom: `${56 * unit}px`}} />
          {scene.items.map((item, i) => <ListItem key={i} text={item} ctx={ctx} delay={wordsIn + 6 + i * (ctx.punchy ? 7 : 10)} />)}
        </Block>
      );
    case 'quote':
      return (
        <Block ctx={ctx} top={landscape ? '18%' : '24%'}>
          <div style={{fontSize: `${260 * unit}px`, lineHeight: 0.6, height: `${130 * unit}px`, color: ctx.accent, fontFamily: 'Georgia, serif', opacity: useEnter(ctx)}}>“</div>
          <Words text={scene.headline} ctx={ctx} delay={6} style={{...headlineStyle(ctx, 0.78), fontWeight: 700, letterSpacing: 0, maxWidth: landscape ? '80%' : '100%'}} />
          <Detail text={scene.detail && `— ${scene.detail}`} ctx={ctx} delay={wordsIn + 12} style={{color: ctx.accent, opacity: 1}} />
        </Block>
      );
    case 'compare':
      return (
        <Block ctx={ctx} top={landscape ? '15%' : '18%'}>
          <Words text={scene.headline} ctx={ctx} style={{...headlineStyle(ctx, 0.75), marginBottom: `${56 * unit}px`}} />
          <div style={{display: 'flex', flexDirection: landscape ? 'row' : 'column', gap: `${36 * unit}px`}}>
            <Card label={scene.left.label} text={scene.left.text} ctx={ctx} delay={wordsIn + 4} highlight={false} />
            <Card label={scene.right.label} text={scene.right.text} ctx={ctx} delay={wordsIn + 14} highlight />
          </div>
        </Block>
      );
    case 'chart': {
      const max = Math.max(...scene.bars.map((b) => b.value));
      return (
        <Block ctx={ctx} top={landscape ? '14%' : '20%'}>
          <Words text={scene.headline} ctx={ctx} style={{...headlineStyle(ctx, 0.75), marginBottom: `${60 * unit}px`}} />
          {scene.bars.map((bar, i) => <Bar key={i} label={bar.label} value={bar.value} unitLabel={scene.unit ?? ''} share={bar.value / max} highlight={bar.value === max} ctx={ctx} delay={wordsIn + 4 + i * 6} />)}
          <Detail text={scene.detail} ctx={ctx} delay={wordsIn + 10 + scene.bars.length * 6} style={{fontSize: `${32 * unit}px`}} />
        </Block>
      );
    }
    case 'image': {
      const zoom = interpolate(frame, [0, scene.duration * fps], [1.04, 1.14]);
      const reveal = useEnter(ctx);
      return (
        <>
          <AbsoluteFill style={{clipPath: `inset(${(1 - reveal) * 50}% 0 ${(1 - reveal) * 50}% 0)`}}>
            <Img src={staticFile(scene.src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
            <AbsoluteFill style={{background: `linear-gradient(to top, ${ctx.brief.brand.background} 8%, ${ctx.brief.brand.background}00 60%)`}} />
          </AbsoluteFill>
          <div style={{position: 'absolute', left: '8%', right: '8%', bottom: landscape ? '16%' : '14%'}}>
            <Words text={scene.headline} ctx={ctx} delay={8} style={headlineStyle(ctx, 0.85)} />
            <Detail text={scene.detail} ctx={ctx} delay={wordsIn + 14} />
          </div>
        </>
      );
    }
    case 'outro': {
      const p = useEnter(ctx, wordsIn + 10);
      const {logo, name} = ctx.brief.brand;
      return (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 8%'}}>
          {logo ? <Img src={staticFile(logo)} style={{height: `${140 * unit}px`, marginBottom: `${60 * unit}px`, opacity: useEnter(ctx)}} />
            : <div style={{fontSize: `${40 * unit}px`, letterSpacing: `${10 * unit}px`, fontWeight: 700, textTransform: 'uppercase', color: ctx.accent, marginBottom: `${50 * unit}px`, opacity: useEnter(ctx)}}>{name}</div>}
          <Words text={scene.headline} ctx={ctx} delay={6} style={headlineStyle(ctx)} />
          {scene.detail && (
            <div style={{marginTop: `${70 * unit}px`, padding: `${26 * unit}px ${56 * unit}px`, borderRadius: `${999}px`, background: ctx.accent, color: ctx.brief.brand.background, fontWeight: 700, fontSize: `${40 * unit}px`, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
              {scene.detail}
            </div>
          )}
        </AbsoluteFill>
      );
    }
  }
};

/** Vertically centered content column between the brand header and progress footer. */
const Block = ({ctx, children}: {ctx: Ctx; top?: string; children: ReactNode}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: ctx.landscape ? '12% 8% 10%' : '24% 8% 20%'}}>
    <div>{children}</div>
  </AbsoluteFill>
);

const ListItem = ({text, ctx, delay}: {text: string; ctx: Ctx; delay: number}) => {
  const p = useEnter(ctx, delay);
  const {unit} = ctx;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: `${30 * unit}px`, marginBottom: `${34 * unit}px`, opacity: p, transform: `translateX(${(1 - p) * -60 * unit}px)`}}>
      <div style={{flex: 'none', width: `${22 * unit}px`, height: `${22 * unit}px`, borderRadius: '50%', background: ctx.accent, transform: `scale(${p})`}} />
      <div style={{fontSize: `${(ctx.landscape ? 50 : 52) * unit}px`, fontWeight: 600, lineHeight: 1.25}}>{text}</div>
    </div>
  );
};

const Card = ({label, text, ctx, delay, highlight}: {label: string; text: string; ctx: Ctx; delay: number; highlight: boolean}) => {
  const p = useEnter(ctx, delay);
  const {unit, brief} = ctx;
  return (
    <div style={{flex: 1, padding: `${44 * unit}px`, borderRadius: `${28 * unit}px`, border: `${3 * unit}px solid ${highlight ? ctx.accent : `${brief.brand.foreground}33`}`, background: highlight ? `${ctx.accent}1f` : `${brief.brand.foreground}0a`, opacity: highlight ? p : p * 0.75, transform: `translateY(${(1 - p) * 50 * unit}px)`}}>
      <div style={{fontSize: `${28 * unit}px`, letterSpacing: `${4 * unit}px`, textTransform: 'uppercase', fontWeight: 700, color: highlight ? ctx.accent : brief.brand.foreground, opacity: highlight ? 1 : 0.6, marginBottom: `${20 * unit}px`}}>{label}</div>
      <div style={{fontSize: `${44 * unit}px`, lineHeight: 1.3, fontWeight: highlight ? 700 : 400}}>{text}</div>
    </div>
  );
};

const Bar = ({label, value, unitLabel, share, highlight, ctx, delay}: {label: string; value: number; unitLabel: string; share: number; highlight: boolean; ctx: Ctx; delay: number}) => {
  const p = useEnter(ctx, delay);
  const {unit} = ctx;
  return (
    <div style={{marginBottom: `${34 * unit}px`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: `${34 * unit}px`, marginBottom: `${12 * unit}px`, opacity: Math.min(1, p * 1.5)}}>
        <span style={{opacity: 0.8}}>{label}</span>
        <span style={{fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: highlight ? ctx.accent : undefined}}>{Math.round(value * Math.min(1, p))}{unitLabel}</span>
      </div>
      <div style={{height: `${36 * unit}px`, borderRadius: `${10 * unit}px`, background: `${ctx.brief.brand.foreground}14`}}>
        <div style={{height: '100%', width: `${share * 100 * Math.min(1, p)}%`, borderRadius: `${10 * unit}px`, background: highlight ? ctx.accent : ctx.secondary}} />
      </div>
    </div>
  );
};

/** Slowly drifting shapes; each scene index gets a different arrangement. */
const Backdrop = ({ctx, index}: {ctx: Ctx; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = frame / fps;
  const flip = index % 2 === 1;
  const {unit, accent, secondary} = ctx;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: '-22%', [flip ? 'left' : 'right']: '-20%', width: '84%', aspectRatio: '1', borderRadius: '50%', border: `${2 * unit}px solid ${accent}`, opacity: 0.22, transform: `scale(${1 + drift / 40}) rotate(${drift * 4}deg)`}} />
      <div style={{position: 'absolute', bottom: '-28%', [flip ? 'right' : 'left']: '-30%', width: '90%', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle, ${secondary}30, ${secondary}00 70%)`, transform: `translateY(${Math.sin(drift / 2) * 30 * unit}px)`}} />
      <div style={{position: 'absolute', top: '22%', [flip ? 'left' : 'right']: '4%', width: `${14 * unit}px`, height: `${14 * unit}px`, borderRadius: '50%', background: accent, opacity: 0.6, transform: `translateY(${Math.cos(drift) * 40 * unit}px)`}} />
    </AbsoluteFill>
  );
};

const Scene = ({scene, index, start, ctx}: {scene: SceneData; index: number; start: number; ctx: Ctx}) => {
  const frame = useCurrentFrame();
  const {brief, unit, landscape} = ctx;
  const progress = Math.min(1, (start + frame) / totalFrames(brief));
  return (
    <AbsoluteFill style={{background: brief.brand.background, color: brief.brand.foreground, fontFamily: fontFamily(brief.brand.font), overflow: 'hidden'}}>
      <Backdrop ctx={ctx} index={index} />
      <Content scene={scene} ctx={ctx} />
      {scene.kind !== 'outro' && (
        <div style={{position: 'absolute', top: landscape ? '8%' : '6%', left: '8%', display: 'flex', alignItems: 'center', gap: `${20 * unit}px`}}>
          {brief.brand.logo && <Img src={staticFile(brief.brand.logo)} style={{height: `${44 * unit}px`}} />}
          <span style={{fontWeight: 700, letterSpacing: `${5 * unit}px`, fontSize: `${Math.max(22, 25 * unit)}px`, textTransform: 'uppercase', opacity: 0.82}}>{brief.brand.name}</span>
        </div>
      )}
      <div style={{position: 'absolute', bottom: '6%', left: '8%', right: '8%', display: 'flex', alignItems: 'center', gap: `${20 * unit}px`}}>
        <div style={{height: `${4 * unit}px`, flex: 1, background: `${brief.brand.foreground}30`, borderRadius: 99}}>
          <div style={{height: '100%', width: `${progress * 100}%`, background: ctx.accent, borderRadius: 99}} />
        </div>
        <span style={{fontSize: `${25 * unit}px`, opacity: 0.65, fontVariantNumeric: 'tabular-nums'}}>{String(index + 1).padStart(2, '0')} / {String(brief.scenes.length).padStart(2, '0')}</span>
      </div>
    </AbsoluteFill>
  );
};

// Presentations have distinct prop types; TransitionSeries only needs a common shape.
const presentation = (kind: Transition, landscape: boolean): TransitionPresentation<Record<string, unknown>> => {
  if (kind === 'slide') return slide({direction: landscape ? 'from-right' : 'from-bottom'}) as TransitionPresentation<Record<string, unknown>>;
  if (kind === 'wipe') return wipe({direction: landscape ? 'from-left' : 'from-top'}) as TransitionPresentation<Record<string, unknown>>;
  return fade() as TransitionPresentation<Record<string, unknown>>;
};

export const Video = (brief: Brief) => {
  const {width, height} = useVideoConfig();
  const landscape = width > height;
  const ctx: Ctx = {
    brief, landscape, unit: width / (landscape ? 1920 : 1080), punchy: brief.brand.motion === 'punchy',
    accent: brief.brand.accent, secondary: brief.brand.secondary ?? brief.brand.accent,
  };
  const cuts = overlaps(brief);
  let start = 0;
  return (
    <AbsoluteFill style={{background: brief.brand.background}}>
      <TransitionSeries>
        {brief.scenes.flatMap((scene, index) => {
          const frames = sceneFrames(brief, scene);
          const sceneStart = start;
          start += frames - cuts[index];
          const items = [
            <TransitionSeries.Sequence key={`s${index}`} durationInFrames={frames}>
              <Scene scene={scene} index={index} start={sceneStart} ctx={ctx} />
            </TransitionSeries.Sequence>,
          ];
          if (cuts[index]) {
            items.push(<TransitionSeries.Transition key={`t${index}`} presentation={presentation(scene.transition ?? 'fade', landscape)} timing={linearTiming({durationInFrames: transitionFrames(brief)})} />);
          }
          return items;
        })}
      </TransitionSeries>
      {brief.audio && <Audio src={staticFile(brief.audio)} />}
    </AbsoluteFill>
  );
};
