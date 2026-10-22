import React from "react";
import {Audio, staticFile} from "remotion";
import {Omega3SmedsScene} from "./Omega3SmedsScene";
import {smedsProject} from "./project";
import type {SmedsVideoProject} from "./types";

export const Omega3SmedsVideo: React.FC<{project?: SmedsVideoProject}> = ({
  project = smedsProject,
}) => {
  return (
    <>
      <Omega3SmedsScene project={project} />
      {/* Scratch audio timing track */}
      {project.narrationSrc && (
        <Audio src={staticFile(project.narrationSrc)} volume={0.6} />
      )}
    </>
  );
};
