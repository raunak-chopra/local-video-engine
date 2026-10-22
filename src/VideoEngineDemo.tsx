import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Backdrop} from "./components/Backdrop";
import {Caption} from "./components/Caption";
import type {VideoProject} from "./video/types";

const ACCENT = "#62e7ff";
const LIME = "#b9ff66";

const Fade: React.FC<React.PropsWithChildren<{duration: number}>> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 12, duration - 14, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const IntroScene: React.FC<{project: VideoProject}> = ({project}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 95}});
  const labelOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Fade duration={150}>
      <AbsoluteFill style={{justifyContent: "center", padding: "0 170px"}}>
        <div
          style={{
            opacity: labelOpacity,
            color: ACCENT,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 6,
          }}
        >
          PERSONAL VIDEO ENGINE
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 1260,
            fontSize: 118,
            fontWeight: 780,
            letterSpacing: -7,
            lineHeight: 0.96,
            transform: `translateY(${44 * (1 - enter)}px)`,
            opacity: enter,
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            marginTop: 36,
            color: "#a9bfd0",
            fontSize: 38,
            letterSpacing: -1,
            opacity: interpolate(frame, [36, 62], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {project.subtitle}
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const pipelineSteps = [
  {number: "01", label: "Brief", note: "One focused idea"},
  {number: "02", label: "Timing", note: "Words become cues"},
  {number: "03", label: "Scenes", note: "React creates motion"},
  {number: "04", label: "Render", note: "Frames become video"},
];

const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [20, 174], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Fade duration={210}>
      <AbsoluteFill style={{padding: "150px 150px 130px"}}>
        <div
          style={{fontSize: 28, color: ACCENT, fontWeight: 800, letterSpacing: 4}}
        >
          A REPEATABLE PIPELINE
        </div>
        <div
          style={{fontSize: 70, fontWeight: 750, letterSpacing: -4, marginTop: 18}}
        >
          From prompt to MP4.
        </div>
        <div style={{position: "relative", display: "flex", gap: 28, marginTop: 110}}>
          <div
            style={{
              position: "absolute",
              left: 55,
              right: 55,
              top: 55,
              height: 3,
              background: "rgba(255,255,255,.12)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${ACCENT}, ${LIME})`,
                boxShadow: `0 0 24px ${ACCENT}`,
              }}
            />
          </div>
          {pipelineSteps.map((step, index) => {
            const reveal = spring({
              frame: frame - index * 22,
              fps: 30,
              config: {damping: 18},
            });
            return (
              <div
                key={step.number}
                style={{
                  zIndex: 1,
                  flex: 1,
                  minHeight: 300,
                  border: "1px solid rgba(255,255,255,.13)",
                  borderRadius: 28,
                  background:
                    "linear-gradient(155deg, rgba(21,45,64,.94), rgba(8,18,31,.92))",
                  padding: 34,
                  opacity: reveal,
                  transform: `translateY(${30 * (1 - reveal)}px)`,
                  boxShadow: "0 26px 80px rgba(0,0,0,.24)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: index <= progress * 4 ? ACCENT : "#183247",
                    color: "#06101c",
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                >
                  {step.number}
                </div>
                <div
                  style={{
                    marginTop: 74,
                    fontSize: 42,
                    fontWeight: 760,
                    letterSpacing: -2,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{marginTop: 15, color: "#9eb5c6", fontSize: 25, lineHeight: 1.35}}
                >
                  {step.note}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

const agents = [
  {name: "Antigravity", job: "Visual iteration", color: "#f7c56a"},
  {name: "Codex", job: "Build & verify", color: ACCENT},
  {name: "Claude Code", job: "Script & scenes", color: "#d6a6ff"},
];

const AgentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Fade duration={180}>
      <AbsoluteFill style={{padding: "138px 160px", justifyContent: "center"}}>
        <div style={{fontSize: 28, color: LIME, fontWeight: 850, letterSpacing: 4}}>
          THREE AGENTS. ONE SOURCE OF TRUTH.
        </div>
        <div
          style={{fontSize: 74, fontWeight: 760, letterSpacing: -4, marginTop: 20}}
        >
          Create, inspect, improve.
        </div>
        <div style={{display: "flex", gap: 28, marginTop: 76}}>
          {agents.map((agent, index) => {
            const reveal = spring({
              frame: frame - 12 - index * 16,
              fps: 30,
              config: {damping: 17},
            });
            return (
              <div
                key={agent.name}
                style={{
                  flex: 1,
                  padding: "34px 38px",
                  borderRadius: 24,
                  border: `1px solid ${agent.color}55`,
                  background: "rgba(8,20,34,.82)",
                  opacity: reveal,
                  transform: `scale(${0.92 + reveal * 0.08})`,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 99,
                    background: agent.color,
                    boxShadow: `0 0 24px ${agent.color}`,
                  }}
                />
                <div
                  style={{fontSize: 36, fontWeight: 760, marginTop: 32, letterSpacing: -1.4}}
                >
                  {agent.name}
                </div>
                <div style={{fontSize: 24, color: "#9eb5c6", marginTop: 10}}>
                  {agent.job}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 60,
            fontSize: 27,
            color: "#d5e2ea",
            opacity: interpolate(frame, [80, 110], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Local tools. Reusable components. Your creative control.
        </div>
      </AbsoluteFill>
    </Fade>
  );
};

export const VideoEngineDemo: React.FC<{project: VideoProject}> = ({project}) => (
  <Backdrop>
    <Sequence durationInFrames={150}>
      <IntroScene project={project} />
    </Sequence>
    <Sequence from={150} durationInFrames={210}>
      <PipelineScene />
    </Sequence>
    <Sequence from={360} durationInFrames={180}>
      <AgentsScene />
    </Sequence>
    <Caption cues={project.captions} />
  </Backdrop>
);
