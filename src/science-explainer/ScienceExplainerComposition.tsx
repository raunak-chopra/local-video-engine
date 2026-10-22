import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {WordCaption} from "./components/WordCaption";
import type {ScienceProject} from "./types";

const CYAN = "#58e6d9";
const GOLD = "#ffd166";
const CORAL = "#ff6b6b";
const BLUE = "#4d96ff";

// Safe area container: 80px padding > 64px requirement
const SafeLayout: React.FC<React.PropsWithChildren<{title: string; category: string}>> = ({
  children,
  title,
  category,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({frame, fps, config: {damping: 18}});

  return (
    <AbsoluteFill
      style={{
        padding: "80px",
        background: "radial-gradient(circle at 50% 40%, #0d1e33 0%, #050a12 100%)",
        color: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Background scientific grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(#58e6d9 1px, transparent 1px), linear-gradient(90deg, #58e6d9 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Header inside safe zone */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: reveal,
          transform: `translateY(${15 * (1 - reveal)}px)`,
          zIndex: 10,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 18,
              letterSpacing: 4,
              fontWeight: 800,
              color: CYAN,
              textTransform: "uppercase",
            }}
          >
            {category}
          </span>
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: -1.5,
              marginTop: 6,
            }}
          >
            {title}
          </h2>
        </div>
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 99,
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: 16,
            fontWeight: 700,
            color: "#a0b5cb",
            letterSpacing: 1,
          }}
        >
          SCIENCE EXPLAINER
        </div>
      </div>

      {/* Main visual slot */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Scene 1: Introduction (Frames 0 - 90)
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 14, stiffness: 100}});

  return (
    <SafeLayout category="Core Concepts" title="From Atoms to Mixtures">
      <div style={{textAlign: "center", transform: `scale(${scale})`}}>
        <div
          style={{
            display: "inline-flex",
            gap: 24,
            marginBottom: 36,
          }}
        >
          {["Atom", "Element", "Molecule", "Compound", "Mixture"].map(
            (term, idx) => (
              <div
                key={term}
                style={{
                  padding: "14px 24px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${idx === 0 ? CYAN : "rgba(255,255,255,0.12)"}`,
                  fontSize: 22,
                  fontWeight: 700,
                  color: idx === 0 ? CYAN : "#cbdbe8",
                }}
              >
                {term}
              </div>
            ),
          )}
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          How Matter Assembles Into Everything You See
        </div>
      </div>
    </SafeLayout>
  );
};

// Scene 2: The Atom (Frames 90 - 210)
const AtomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame;

  // Rotation angles for electron orbits
  const angle1 = (t * 0.08) % (Math.PI * 2);
  const angle2 = ((t * 0.08) + Math.PI) % (Math.PI * 2);
  const rX = 220;
  const rY = 90;

  return (
    <SafeLayout category="01 · Fundamental Unit" title="The Atom">
      <div style={{position: "relative", width: 600, height: 400}}>
        {/* Orbit ring 1 (tilted 35 deg) */}
        <div
          style={{
            position: "absolute",
            width: rX * 2,
            height: rY * 2,
            left: 300 - rX,
            top: 200 - rY,
            borderRadius: "50%",
            border: "2px dashed rgba(88, 230, 217, 0.4)",
            transform: "rotate(-30deg)",
          }}
        />

        {/* Orbit ring 2 (tilted -35 deg) */}
        <div
          style={{
            position: "absolute",
            width: rX * 2,
            height: rY * 2,
            left: 300 - rX,
            top: 200 - rY,
            borderRadius: "50%",
            border: "2px dashed rgba(88, 230, 217, 0.4)",
            transform: "rotate(30deg)",
          }}
        />

        {/* Nucleus cluster */}
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 200,
            transform: "translate(-50%, -50%)",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ff6b6b 0%, #d63031 100%)",
            boxShadow: "0 0 45px rgba(255, 107, 107, 0.7)",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            fontSize: 22,
          }}
        >
          Nucleus
        </div>

        {/* Electron 1 */}
        <div
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: CYAN,
            boxShadow: `0 0 20px ${CYAN}`,
            left: 300 + Math.cos(angle1) * rX * Math.cos(-0.52) - Math.sin(angle1) * rY * Math.sin(-0.52) - 12,
            top: 200 + Math.cos(angle1) * rX * Math.sin(-0.52) + Math.sin(angle1) * rY * Math.cos(-0.52) - 12,
          }}
        />

        {/* Electron 2 */}
        <div
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: CYAN,
            boxShadow: `0 0 20px ${CYAN}`,
            left: 300 + Math.cos(angle2) * rX * Math.cos(0.52) - Math.sin(angle2) * rY * Math.sin(0.52) - 12,
            top: 200 + Math.cos(angle2) * rX * Math.sin(0.52) + Math.sin(angle2) * rY * Math.cos(0.52) - 12,
          }}
        />
      </div>
    </SafeLayout>
  );
};

// Scene 3: Element & Molecule (Frames 210 - 340)
const ElementMoleculeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame;

  // Molecular bond snap occurs at relative frame ~87 (global 297) on word "BOND"
  const bondProgress = spring({
    frame: t - 80,
    fps,
    config: {damping: 12, stiffness: 240},
  });

  const atomSeparation = interpolate(bondProgress, [0, 1], [220, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SafeLayout category="02 · Bonding" title="Elements vs. Molecules">
      <div style={{display: "flex", gap: 80, alignItems: "center"}}>
        {/* Element Box: Pure identical atoms */}
        <div
          style={{
            padding: "36px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: 24,
            border: "1px solid rgba(255, 255, 255, 0.12)",
            textAlign: "center",
          }}
        >
          <div style={{fontSize: 22, color: GOLD, fontWeight: 700, marginBottom: 24}}>
            ELEMENT (One type of atom)
          </div>
          <div style={{display: "flex", gap: 20}}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: GOLD,
                  boxShadow: `0 0 25px ${GOLD}66`,
                  display: "grid",
                  placeItems: "center",
                  color: "#241800",
                  fontWeight: 800,
                  fontSize: 24,
                }}
              >
                Au
              </div>
            ))}
          </div>
        </div>

        {/* Molecule Box: Bond snap */}
        <div
          style={{
            padding: "36px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: 24,
            border: "1px solid rgba(255, 255, 255, 0.12)",
            textAlign: "center",
          }}
        >
          <div style={{fontSize: 22, color: CYAN, fontWeight: 700, marginBottom: 24}}>
            MOLECULE (Bonded atoms)
          </div>
          <div
            style={{
              position: "relative",
              width: 320,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Bond connector line */}
            <div
              style={{
                position: "absolute",
                height: 10,
                width: 120,
                background: CYAN,
                boxShadow: `0 0 20px ${CYAN}`,
                borderRadius: 5,
                opacity: bondProgress,
                transform: `scaleX(${bondProgress})`,
              }}
            />
            {/* Oxygen 1 */}
            <div
              style={{
                position: "absolute",
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: CORAL,
                boxShadow: `0 0 25px ${CORAL}88`,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 26,
                transform: `translateX(-${atomSeparation / 2}px)`,
              }}
            >
              O
            </div>
            {/* Oxygen 2 */}
            <div
              style={{
                position: "absolute",
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: CORAL,
                boxShadow: `0 0 25px ${CORAL}88`,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 26,
                transform: `translateX(${atomSeparation / 2}px)`,
              }}
            >
              O
            </div>
          </div>
        </div>
      </div>
    </SafeLayout>
  );
};

// Scene 4: Compounds (Frames 340 - 470)
const CompoundScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame;
  const reveal = spring({frame: t, fps, config: {damping: 14}});

  return (
    <SafeLayout category="03 · Chemical Union" title="Compounds">
      <div style={{textAlign: "center", opacity: reveal}}>
        <div
          style={{
            fontSize: 26,
            color: "#a9bfd0",
            marginBottom: 36,
          }}
        >
          All compounds are molecules, but they must contain <span style={{color: CYAN, fontWeight: 800}}>different elements</span>.
        </div>

        {/* H2O Model */}
        <div
          style={{
            position: "relative",
            width: 380,
            height: 220,
            margin: "0 auto",
          }}
        >
          {/* Central Oxygen */}
          <div
            style={{
              position: "absolute",
              left: 190 - 45,
              top: 130 - 45,
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: CORAL,
              boxShadow: `0 0 35px ${CORAL}88`,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 32,
              zIndex: 2,
            }}
          >
            O
          </div>

          {/* Hydrogen 1 */}
          <div
            style={{
              position: "absolute",
              left: 70 - 28,
              top: 40 - 28,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: BLUE,
              boxShadow: `0 0 25px ${BLUE}88`,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 22,
              zIndex: 2,
            }}
          >
            H
          </div>

          {/* Hydrogen 2 */}
          <div
            style={{
              position: "absolute",
              left: 310 - 28,
              top: 40 - 28,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: BLUE,
              boxShadow: `0 0 25px ${BLUE}88`,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 22,
              zIndex: 2,
            }}
          >
            H
          </div>

          {/* Bond 1 */}
          <div
            style={{
              position: "absolute",
              left: 100,
              top: 60,
              width: 90,
              height: 8,
              background: "rgba(255, 255, 255, 0.4)",
              transform: "rotate(38deg)",
              transformOrigin: "left center",
            }}
          />

          {/* Bond 2 */}
          <div
            style={{
              position: "absolute",
              left: 200,
              top: 110,
              width: 90,
              height: 8,
              background: "rgba(255, 255, 255, 0.4)",
              transform: "rotate(-38deg)",
              transformOrigin: "left center",
            }}
          />
        </div>
      </div>
    </SafeLayout>
  );
};

// Scene 5: Mixtures (Frames 470 - 600)
const MixtureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame;

  // Salt water metaphor: Na+ and Cl- floating alongside water molecules without covalent bonding
  const particles = [
    {label: "Na+", color: GOLD, x: 220 + Math.sin(t * 0.05) * 20, y: 120 + Math.cos(t * 0.04) * 15},
    {label: "Cl-", color: CYAN, x: 480 + Math.cos(t * 0.04) * 25, y: 150 + Math.sin(t * 0.06) * 20},
    {label: "H2O", color: BLUE, x: 340 + Math.sin(t * 0.03) * 30, y: 220 + Math.sin(t * 0.05) * 15},
    {label: "H2O", color: BLUE, x: 620 + Math.cos(t * 0.04) * 20, y: 200 + Math.cos(t * 0.05) * 20},
    {label: "Na+", color: GOLD, x: 740 + Math.sin(t * 0.06) * 15, y: 130 + Math.sin(t * 0.03) * 25},
  ];

  return (
    <SafeLayout category="04 · Physical Mixture" title="Mixtures">
      <div style={{position: "relative", width: 900, height: 320}}>
        <div
          style={{
            textAlign: "center",
            color: "#a9bfd0",
            fontSize: 24,
            marginBottom: 20,
          }}
        >
          No chemical bonds. Substances intermingle physically (e.g. Salt Dissolved in Water).
        </div>
        {particles.map((p, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              padding: "16px 24px",
              borderRadius: 50,
              background: "rgba(255, 255, 255, 0.08)",
              border: `2px solid ${p.color}`,
              boxShadow: `0 0 20px ${p.color}44`,
              color: p.color,
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            {p.label}
          </div>
        ))}
      </div>
    </SafeLayout>
  );
};

export const ScienceExplainerComposition: React.FC<{project: ScienceProject}> = ({
  project,
}) => {
  return (
    <AbsoluteFill style={{background: "#050a12"}}>
      <Sequence durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <AtomScene />
      </Sequence>
      <Sequence from={210} durationInFrames={130}>
        <ElementMoleculeScene />
      </Sequence>
      <Sequence from={340} durationInFrames={130}>
        <CompoundScene />
      </Sequence>
      <Sequence from={470} durationInFrames={130}>
        <MixtureScene />
      </Sequence>
      <WordCaption words={project.words} />
    </AbsoluteFill>
  );
};
