import {createContext, useContext} from "react";
import type {GraphicSceneSpec} from "./project-schema";

type GraphicMotion = GraphicSceneSpec["motion"];
const MotionContext = createContext<GraphicMotion>(undefined);

/** Local to a scene: clip timing and caption animation are independent. */
export const GraphicMotionProvider = MotionContext.Provider;
export const useGraphicMotion = () => useContext(MotionContext);
