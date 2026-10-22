import {Video} from "@remotion/media";
import React from "react";
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {PreparedMedia} from "../assets";
import type {ClipSceneSpec} from "../project-schema";

/**
 * A trimmed footage clip. Cropping is done by sizing a box to the clip's
 * display aspect ratio and offsetting it by the focus point; the video fills
 * that box exactly, so framing does not depend on the player's object-position.
 * Hard cut by default; `transitionIn` adds an explicit fade.
 */
export const Clip: React.FC<{
  scene: ClipSceneSpec;
  media: PreparedMedia;
  trim: {before: number; after: number};
}> = ({scene, media, trim}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const sourceWidth = media.width ?? width;
  const sourceHeight = media.height ?? height;
  const scale = (scene.fit === "cover" ? Math.max : Math.min)(width / sourceWidth, height / sourceHeight);
  const boxWidth = sourceWidth * scale;
  const boxHeight = sourceHeight * scale;
  const opacity = scene.transitionIn
    ? interpolate(frame, [0, scene.transitionIn.frames], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})
    : 1;
  const muted = scene.sourceAudio.mute || !media.hasAudio;
  // Constant per clip for now; gain envelopes and ducking arrive with the audio slice.
  const gain = muted ? 0 : 10 ** (scene.sourceAudio.gainDb / 20);
  return (
    <AbsoluteFill style={{backgroundColor: "black", opacity}}>
      <div
        style={{
          position: "absolute",
          width: boxWidth,
          height: boxHeight,
          left: (width - boxWidth) * scene.focus.x,
          top: (height - boxHeight) * scene.focus.y,
        }}
      >
        <Video
          src={staticFile(media.src)}
          trimBefore={trim.before}
          trimAfter={trim.after}
          objectFit="fill"
          muted={muted}
          volume={() => gain}
          style={{width: "100%", height: "100%"}}
        />
      </div>
    </AbsoluteFill>
  );
};
