import {useEffect, useRef, useState} from "react";
import {cancelRender, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import type {ProjectV2} from "./project-schema";
import type {ResolvedTimeline} from "./resolve-timeline";
import {fontFamilyFor, safeRectangle} from "./text-design";

const TextBox: React.FC<{item: ResolvedTimeline["textOverlays"][number]; project: ProjectV2}> = ({item, project}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const {cue, startFrame, endFrame} = item;
  const rect = safeRectangle(width, height, project.safeArea);
  const unit = Math.min(width, height) / 1080;
  const ref = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender(`Check text overlay ${cue.id}`));
  useEffect(() => {
    const element = ref.current;
    document.fonts.ready.then(() => {
      if (!element) throw new Error(`Missing text overlay ${cue.id}`);
      if (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1) {
        throw new Error(`Text overlay "${cue.id}" overflows its box. Preserve copy; increase box/hold or use an approved layout revision.`);
      }
      continueRender(handle);
    }).catch(cancelRender);
  }, [handle, cue, width, height]);
  const local = frame - startFrame;
  const length = endFrame - startFrame;
  const edge = Math.min(cue.motion?.frames ?? 6, Math.max(1, Math.floor((length - 1) / 2)));
  const enter = !cue.motion || cue.motion.enter === "cut" || length < 3 ? 1
    : interpolate(local, [0, edge], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const exit = cue.motion?.exit !== "fade" || length < 3 ? 1
    : interpolate(local, [length - 1 - edge, length - 1], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const s = cue.style;
  const riseDistance = Math.min(20 * unit, Math.max(0, (1 - cue.box.y - cue.box.height) * rect.height));
  return <div style={{position: "absolute", left: rect.x + cue.box.x * rect.width, top: rect.y + cue.box.y * rect.height,
    width: cue.box.width * rect.width, height: cue.box.height * rect.height, opacity: enter * exit,
    translate: cue.motion?.enter === "rise" ? `0 ${riseDistance * (1 - enter)}px` : undefined}}>
    <div ref={ref} data-overlay-id={cue.id} style={{width: "100%", height: "100%", boxSizing: "border-box", display: "flex",
      flexDirection: "column", justifyContent: {top: "flex-start", center: "center", bottom: "flex-end"}[s.verticalAlign],
      padding: s.padding * unit, background: s.background, borderRadius: s.borderRadius * unit,
      fontSize: s.fontSize * unit, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing * unit,
      textAlign: s.align, color: s.color, whiteSpace: "pre-wrap", overflowWrap: "break-word",
      WebkitTextStroke: s.strokeWidth ? `${s.strokeWidth * unit}px ${s.strokeColor}` : undefined, paintOrder: "stroke fill"}}>
      <div>{cue.runs.map((run, index) => {
        const font = project.fonts.find((entry) => entry.id === run.fontId);
        return <span key={index} style={{fontFamily: `"${fontFamilyFor(run.fontId)}"`, fontStyle: font?.style, color: run.color}}>{run.text}</span>;
      })}</div>
    </div>
  </div>;
};

export const TextOverlays: React.FC<{project: ProjectV2; timeline: ResolvedTimeline}> = ({project, timeline}) => {
  const frame = useCurrentFrame();
  return <>{timeline.textOverlays.filter((item) => frame >= item.startFrame && frame < item.endFrame)
    .map((item) => <TextBox key={item.cue.id} item={item} project={project} />)}</>;
};
