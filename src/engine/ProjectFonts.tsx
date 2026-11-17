import {loadFont} from "@remotion/fonts";
import {useEffect, useState} from "react";
import {cancelRender, continueRender, delayRender, staticFile} from "remotion";
import type {MediaMap} from "./assets";
import type {ProjectV2} from "./project-schema";
import {fontFamilyFor} from "./text-design";

/** Rendering is held until every declared face is loaded, even off-cue faces. */
export const ProjectFonts: React.FC<React.PropsWithChildren<{project: ProjectV2; media: MediaMap}>> = ({project, media, children}) => {
  const [handle] = useState(() => delayRender("Load project font registry"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(project.fonts.map(async (font) => {
      const source = media[font.asset];
      if (!source || source.kind !== "font") throw new Error(`Missing prepared font: ${font.id}`);
      await loadFont({family: fontFamilyFor(font.id), url: staticFile(source.src), weight: String(font.weight), style: font.style});
    })).then(() => {
      setReady(true);
    }).catch(cancelRender);
  }, [handle, project, media]);
  useEffect(() => { if (ready) continueRender(handle); }, [handle, ready]);
  return ready ? <>{children}</> : null;
};
