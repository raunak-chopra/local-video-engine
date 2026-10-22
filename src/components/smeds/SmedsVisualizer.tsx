import React, {useEffect, useMemo, useRef} from "react";
import {
  computeSmedsMicroPositions,
  generateMicroDroplets,
  getSmedsCapsuleState,
  getSmedsFragmentationDroplets,
  getTraditionalCapsuleState,
  getTraditionalMacroDroplets,
  MacroDropletState,
} from "./MicroDropletSystem";
import {
  fragmentShaderSource,
  microParticleFragmentShader,
  microParticleVertexShader,
  vertexShaderSource,
} from "./SmedsShader";

export type SmedsVisualizerProps = {
  scene: "traditional" | "transition" | "smeds" | "hero_comparison";
  localFrame: number;
  width: number;
  height: number;
  fps?: number;
  macroCount?: number;
  microCount?: number;
  sideBySide?: boolean; // For hero comparison split
};

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vShader: WebGLShader,
  fShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export const SmedsVisualizer: React.FC<SmedsVisualizerProps> = ({
  scene,
  localFrame,
  width,
  height,
  fps = 30,
  macroCount = 22,
  microCount = 2400,
  sideBySide = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pre-generate static micro-droplet definitions once
  const microDroplets = useMemo(
    () => generateMicroDroplets(microCount),
    [microCount],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    // Enable standard blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, width, height);

    // 1. Setup Macro / Raymarching Program
    const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vShader || !fShader) return;
    const macroProgram = createProgram(gl, vShader, fShader);
    if (!macroProgram) return;

    // Quad buffer for fullscreen raymarching pass
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    // 2. Setup Micro-Particle Program
    const vPartShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      microParticleVertexShader,
    );
    const fPartShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      microParticleFragmentShader,
    );
    let particleProgram: WebGLProgram | null = null;
    let particleBuffer: WebGLBuffer | null = null;

    if (vPartShader && fPartShader) {
      particleProgram = createProgram(gl, vPartShader, fPartShader);
      particleBuffer = gl.createBuffer();
    }

    // -------------------------------------------------------------
    // RENDER PASS FOR CURRENT FRAME
    // -------------------------------------------------------------
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Compute simulation states
    let capsuleState = {
      x: 0,
      y: 0,
      angle: 0,
      length: 0,
      radius: 0,
      ruptureProgress: 0,
      shellOpacity: 0,
      glowIntensity: 0,
    };
    let macroDroplets: MacroDropletState[] = [];
    let showMicroParticles = false;
    let microRuptureFrame = 32;

    if (scene === "traditional") {
      capsuleState = getTraditionalCapsuleState(localFrame);
      macroDroplets = getTraditionalMacroDroplets(localFrame, macroCount);
    } else if (scene === "transition") {
      // Zoom into a macro globule core and transition out
      const transT = Math.min(1, Math.max(0, localFrame / 60));
      // Zooming into droplet
      const zoom = 1 + transT * 2.5;
      capsuleState = {
        x: 0.5,
        y: 0.5,
        angle: 0.2,
        length: 130 * zoom,
        radius: 46 * zoom,
        ruptureProgress: 1,
        shellOpacity: Math.max(0, 1 - transT * 1.5),
        glowIntensity: 0.8,
      };
      // A large hero droplet at screen center
      macroDroplets = [
        {
          id: 0,
          x: 0.5 + Math.sin(localFrame * 0.05) * 0.01,
          y: 0.5 + Math.cos(localFrame * 0.04) * 0.01,
          radius: (70 + transT * 180) * (1 - transT * 0.4),
          wobblePhase: localFrame * 0.1,
          opacity: Math.max(0, 1 - transT * 1.2),
          clumpGroup: 0,
        },
      ];
    } else if (scene === "smeds") {
      capsuleState = getSmedsCapsuleState(localFrame);
      showMicroParticles = true;
      microRuptureFrame = 28;
      macroDroplets = getSmedsFragmentationDroplets(localFrame);
    } else if (scene === "hero_comparison") {
      // Dual showcase:
      // Left side: Traditional clumped macro droplets
      // Right side: SMEDS micro-particle cloud
      capsuleState = {
        x: 0,
        y: 0,
        angle: 0,
        length: 0,
        radius: 0,
        ruptureProgress: 0,
        shellOpacity: 0,
        glowIntensity: 0,
      };
      // Traditional clumped droplets centered in left chamber
      macroDroplets = getTraditionalMacroDroplets(140, 18).map((d) => ({
        ...d,
        x: 0.25 + (d.x - 0.60) * 0.75,
        y: 0.44 + (d.y - 0.26) * 0.75,
        radius: d.radius * 0.85,
      }));
      showMicroParticles = true;
      microRuptureFrame = 0; // already fully dispersed
    }

    // -------------------------------------------------------------
    // PASS 1: RENDER RAYMARCHED CAPSULE & MACRO DROPLETS
    // -------------------------------------------------------------
    gl.useProgram(macroProgram);

    // Uniforms
    const uResLoc = gl.getUniformLocation(macroProgram, "uResolution");
    const uTimeLoc = gl.getUniformLocation(macroProgram, "uTime");
    const uCapsulePosLoc = gl.getUniformLocation(macroProgram, "uCapsulePos");
    const uCapsuleAngleLoc = gl.getUniformLocation(macroProgram, "uCapsuleAngle");
    const uCapsuleLengthLoc = gl.getUniformLocation(macroProgram, "uCapsuleLength");
    const uCapsuleRadiusLoc = gl.getUniformLocation(macroProgram, "uCapsuleRadius");
    const uCapsuleRuptureLoc = gl.getUniformLocation(macroProgram, "uCapsuleRupture");
    const uCapsuleOpacityLoc = gl.getUniformLocation(macroProgram, "uCapsuleOpacity");
    const uDropletCountLoc = gl.getUniformLocation(macroProgram, "uDropletCount");

    gl.uniform2f(uResLoc, width, height);
    gl.uniform1f(uTimeLoc, localFrame / fps);
    gl.uniform2f(uCapsulePosLoc, capsuleState.x, capsuleState.y);
    gl.uniform1f(uCapsuleAngleLoc, capsuleState.angle);
    gl.uniform1f(uCapsuleLengthLoc, capsuleState.length);
    gl.uniform1f(uCapsuleRadiusLoc, capsuleState.radius);
    gl.uniform1f(uCapsuleRuptureLoc, capsuleState.ruptureProgress);
    gl.uniform1f(uCapsuleOpacityLoc, capsuleState.shellOpacity);

    // Bind macro droplets (clamp to max 28)
    const validCount = Math.min(macroDroplets.length, 28);
    gl.uniform1i(uDropletCountLoc, validCount);

    for (let i = 0; i < 28; i++) {
      const uDropLoc = gl.getUniformLocation(macroProgram, `uDroplets[${i}]`);
      if (i < validCount) {
        const d = macroDroplets[i];
        // Convert normalized coordinates to screen pixel coordinates
        const px = d.x * width;
        const py = d.y * height;
        gl.uniform4f(uDropLoc, px, py, d.radius, d.opacity);
      } else {
        gl.uniform4f(uDropLoc, 0, 0, 0, 0);
      }
    }

    // Draw quad
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const aPosLoc = gl.getAttribLocation(macroProgram, "aPosition");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // -------------------------------------------------------------
    // PASS 2: RENDER SMEDS MICRO-PARTICLE CLOUD
    // -------------------------------------------------------------
    if (showMicroParticles && particleProgram && particleBuffer) {
      // Additive / bright luminous blending for microscopic particles
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(particleProgram);

      // Uniforms
      const uPResLoc = gl.getUniformLocation(particleProgram, "uResolution");
      const uPDofLoc = gl.getUniformLocation(particleProgram, "uDofFocalPlane");
      gl.uniform2f(uPResLoc, width, height);
      gl.uniform1f(uPDofLoc, 0.5);

      // Compute particle buffer data deterministically
      const particleFrame =
        scene === "hero_comparison"
          ? 120 // fully dispersed state
          : localFrame;

      // Adjust particle origin for hero comparison if sideBySide
      const particleData = computeSmedsMicroPositions(
        microDroplets,
        particleFrame,
        microRuptureFrame,
        width,
        height,
      );

      if (scene === "hero_comparison") {
        // Offset particles to the right half of the screen
        for (let i = 0; i < microDroplets.length; i++) {
          particleData[i * 5 + 0] =
            0.52 * width + (particleData[i * 5 + 0] / width) * 0.48 * width;
          particleData[i * 5 + 1] =
            0.15 * height + (particleData[i * 5 + 1] / height) * 0.75 * height;
          particleData[i * 5 + 2] *= 0.85; // compact scale
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.DYNAMIC_DRAW);

      // Attributes: [px, py, radius, opacity, depth] (stride = 5 floats = 20 bytes)
      const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
      const aPPosLoc = gl.getAttribLocation(particleProgram, "aPosition");
      const aPRadLoc = gl.getAttribLocation(particleProgram, "aRadius");
      const aPOpLoc = gl.getAttribLocation(particleProgram, "aOpacity");
      const aPDepLoc = gl.getAttribLocation(particleProgram, "aDepth");

      gl.enableVertexAttribArray(aPPosLoc);
      gl.vertexAttribPointer(aPPosLoc, 2, gl.FLOAT, false, stride, 0);

      gl.enableVertexAttribArray(aPRadLoc);
      gl.vertexAttribPointer(
        aPRadLoc,
        1,
        gl.FLOAT,
        false,
        stride,
        2 * Float32Array.BYTES_PER_ELEMENT,
      );

      gl.enableVertexAttribArray(aPOpLoc);
      gl.vertexAttribPointer(
        aPOpLoc,
        1,
        gl.FLOAT,
        false,
        stride,
        3 * Float32Array.BYTES_PER_ELEMENT,
      );

      gl.enableVertexAttribArray(aPDepLoc);
      gl.vertexAttribPointer(
        aPDepLoc,
        1,
        gl.FLOAT,
        false,
        stride,
        4 * Float32Array.BYTES_PER_ELEMENT,
      );

      gl.drawArrays(gl.POINTS, 0, microDroplets.length);

      // Restore standard alpha blending
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    return () => {
      // Clean up buffers and programs on unmount
      if (quadBuffer) gl.deleteBuffer(quadBuffer);
      if (particleBuffer) gl.deleteBuffer(particleBuffer);
      if (macroProgram) gl.deleteProgram(macroProgram);
      if (particleProgram) gl.deleteProgram(particleProgram);
      if (vShader) gl.deleteShader(vShader);
      if (fShader) gl.deleteShader(fShader);
      if (vPartShader) gl.deleteShader(vPartShader);
      if (fPartShader) gl.deleteShader(fPartShader);
    };
  }, [
    scene,
    localFrame,
    width,
    height,
    fps,
    macroCount,
    microCount,
    microDroplets,
    sideBySide,
  ]);

  // Tyndall colloidal scattering mist bloom
  const mistOpacity =
    scene === "smeds"
      ? Math.min(0.42, Math.max(0, (localFrame - 28) / 45) * 0.42)
      : scene === "hero_comparison"
        ? 0.38
        : 0;

  return (
    <>
      {mistOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: scene === "hero_comparison" ? "50%" : "47%",
            left: scene === "hero_comparison" ? "75%" : "42%",
            width: scene === "hero_comparison" ? 650 : 920,
            height: scene === "hero_comparison" ? 650 : 920,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.32) 0%, rgba(245, 158, 11, 0.14) 45%, transparent 75%)",
            filter: "blur(70px)",
            opacity: mistOpacity,
            pointerEvents: "none",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </>
  );
};
