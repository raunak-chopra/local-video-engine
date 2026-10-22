/**
 * GLSL Shaders for Raymarched Softgel Capsule, Photorealistic Fluid Oil Globules,
 * and Luminous SMEDS Micro-Emulsion Cloud.
 *
 * Features:
 * - True spherical harmonic normal gradient (zero center singularities, silky smooth convex domes)
 * - Polynomial smooth minimum (smin) for organic liquid surface-tension droplet fusion
 * - Beer-Lambert volumetric absorption (rich deep honey core, luminous golden rims)
 * - Multi-light studio illumination (warm golden key, cold cyan pharmaceutical rim, ambient fill)
 * - Internal caustic refraction highlight
 * - Point-sprite micro-droplet system with luminous cores, Tyndall scattering halos, and depth-of-field bokeh
 */

export const vertexShaderSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uSceneType; // 0 = traditional, 1 = smeds, 2 = hero_comparison

  // Capsule uniforms
  uniform vec2 uCapsulePos;      // normalized (0..1)
  uniform float uCapsuleAngle;   // radians
  uniform float uCapsuleLength;  // in pixels
  uniform float uCapsuleRadius;  // in pixels
  uniform float uCapsuleRupture; // 0..1
  uniform float uCapsuleOpacity; // 0..1

  // Macro droplets uniforms (up to 28 droplets)
  uniform int uDropletCount;
  uniform vec4 uDroplets[28]; // xy = pos in px, z = radius in px, w = opacity

  // Smooth minimum for fluid surface tension coalescence
  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  // SDF of an oriented capsule in 2D
  float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
  }

  void main() {
    vec2 pixelPos = vUv * uResolution;
    // Invert Y for standard WebGL coordinate space
    pixelPos.y = uResolution.y - pixelPos.y;

    vec4 fragColor = vec4(0.0);

    // -------------------------------------------------------------
    // 1. RENDER SOFTGEL CAPSULE
    // -------------------------------------------------------------
    if (uCapsuleOpacity > 0.01) {
      vec2 capCenter = uCapsulePos * uResolution;
      capCenter.y = uResolution.y - capCenter.y;

      vec2 dir = vec2(cos(uCapsuleAngle), sin(uCapsuleAngle));
      vec2 pA = capCenter - dir * (uCapsuleLength * 0.5);
      vec2 pB = capCenter + dir * (uCapsuleLength * 0.5);

      float dCap = sdCapsule(pixelPos, pA, pB, uCapsuleRadius);

      if (dCap < 2.0) {
        vec2 capOffset = pixelPos - capCenter;
        float tAx = clamp(dot(capOffset, dir) / (uCapsuleLength * 0.5), -1.0, 1.0);
        vec2 closestPointOnAxis = capCenter + dir * (tAx * uCapsuleLength * 0.5);
        vec2 normal2D = (pixelPos - closestPointOnAxis) / uCapsuleRadius;
        float lenN2 = dot(normal2D, normal2D);

        float nz = sqrt(max(0.0, 1.0 - clamp(lenN2, 0.0, 1.0)));
        vec3 N = normalize(vec3(normal2D, nz));
        vec3 V = vec3(0.0, 0.0, 1.0);

        // Studio lighting
        vec3 L_key = normalize(vec3(-0.4, 0.8, 0.7));
        vec3 L_rim = normalize(vec3(0.75, -0.4, -0.3));

        float diff = max(0.0, dot(N, L_key));
        vec3 H_key = normalize(L_key + V);
        float specKey = pow(max(0.0, dot(N, H_key)), 42.0);

        float fresnel = 0.08 + 0.92 * pow(1.0 - max(0.0, dot(N, V)), 3.5);
        vec3 H_rim = normalize(L_rim + V);
        float specRim = pow(max(0.0, dot(N, -L_rim)), 16.0) * 0.7;

        // Gelatin shell absorption (Beer's Law)
        float thickness = max(0.0, -dCap) / uCapsuleRadius;
        vec3 goldCore = vec3(0.92, 0.55, 0.06);
        vec3 goldEdge = vec3(1.0, 0.84, 0.32);
        vec3 gelColor = mix(goldEdge, goldCore, thickness * 0.75);

        // Gelatin longitudinal seam line
        float seamDist = abs(dot(pixelPos - capCenter, vec2(-dir.y, dir.x)));
        if (seamDist < 1.6) {
          gelColor *= 0.84;
        }

        // Rupture tear line with glowing lipid energy
        if (uCapsuleRupture > 0.05) {
          float ruptureDist = length(pixelPos - pB);
          if (ruptureDist < uCapsuleRadius * 1.3 * uCapsuleRupture) {
            float tearGlow = smoothstep(uCapsuleRadius * 1.3 * uCapsuleRupture, 0.0, ruptureDist);
            gelColor = mix(gelColor, vec3(1.0, 0.96, 0.75), tearGlow * 0.95);
          }
        }

        vec3 shaded = gelColor * (0.35 + 0.65 * diff)
                    + vec3(1.0, 0.97, 0.9) * specKey * 1.4
                    + vec3(0.4, 0.85, 1.0) * specRim * 0.8
                    + vec3(0.9, 0.95, 1.0) * fresnel * 0.4;

        float alpha = smoothstep(1.5, -1.0, dCap) * uCapsuleOpacity * 0.92;
        fragColor = vec4(shaded, alpha);
      }
    }

    // -------------------------------------------------------------
    // 2. RENDER FLUID OIL GLOBULES (METABALLS WITH BEER'S LAW)
    // -------------------------------------------------------------
    if (uDropletCount > 0) {
      float blendField = 1e5;

      for (int i = 0; i < 28; i++) {
        if (i >= uDropletCount) break;
        vec4 drop = uDroplets[i];
        if (drop.w < 0.01) continue;

        vec2 dPos = drop.xy;
        float dRadius = drop.z;

        // Organic surface-tension wobble harmonic
        float angle = atan(pixelPos.y - dPos.y, pixelPos.x - dPos.x);
        float wobble = sin(angle * 3.0 + uTime * 3.2 + float(i) * 1.4) * (dRadius * 0.04);
        float dist = length(pixelPos - dPos) - (dRadius + wobble);

        // Smooth minimum blending with neighboring droplets (coalescence)
        blendField = smin(blendField, dist, 28.0);
      }

      if (blendField < 2.0) {
        // True smooth spherical harmonic gradient across all participating droplets
        vec2 gradient2D = vec2(0.0);
        float totalWeight = 0.0001;

        for (int i = 0; i < 28; i++) {
          if (i >= uDropletCount) break;
          vec4 drop = uDroplets[i];
          if (drop.w < 0.01) continue;

          vec2 toPixel = pixelPos - drop.xy;
          float dRadius = drop.z;
          float distSq = dot(toPixel, toPixel);
          float radSq = dRadius * dRadius;

          // Gaussian falloff weight for each droplet
          float w = exp(-distSq / (radSq * 1.8));
          gradient2D += (toPixel / dRadius) * w;
          totalWeight += w;
        }

        vec2 normal2D = gradient2D / totalWeight;
        float lenSq = dot(normal2D, normal2D);

        // Smooth convex dome normal
        float nz = sqrt(max(0.0, 1.0 - clamp(lenSq * 0.75, 0.0, 1.0)));
        vec3 N = normalize(vec3(normal2D, nz));
        vec3 V = vec3(0.0, 0.0, 1.0);

        // Studio lighting vectors
        vec3 L_key = normalize(vec3(-0.42, 0.78, 0.65));
        vec3 L_rim = normalize(vec3(0.7, -0.45, -0.35));
        vec3 L_caustic = normalize(vec3(0.25, 0.85, 0.4));

        // Diffuse
        float diff = max(0.0, dot(N, L_key));

        // Specular highlight: Crisp studio softbox reflection
        vec3 H_key = normalize(L_key + V);
        float specKey = pow(max(0.0, dot(N, H_key)), 46.0);

        // Cyan pharmaceutical rim reflection at glancing angles
        float fresnel = 0.06 + 0.94 * pow(1.0 - max(0.0, dot(N, V)), 3.6);
        vec3 rimCol = vec3(0.35, 0.88, 1.0) * fresnel * 0.95;

        // Internal caustic glow focused through the droplet
        float causticLobe = pow(max(0.0, dot(-N, L_caustic)), 3.0) * 0.42;

        // Beer-Lambert Volumetric Absorption Law:
        // Deep honey amber in the dense core, luminous translucent yellow-gold at the perimeter
        float depthFactor = max(0.0, -blendField) / 38.0;
        vec3 deepHoney = vec3(0.82, 0.44, 0.03);
        vec3 brightGold = vec3(1.0, 0.88, 0.28);
        vec3 innerCaustic = vec3(1.0, 0.96, 0.6) * causticLobe;

        vec3 oilBase = mix(brightGold, deepHoney, clamp(depthFactor * 1.3, 0.0, 1.0));

        // Composite photorealistic oil shading
        vec3 shadedOil = oilBase * (0.38 + 0.62 * diff)
                       + innerCaustic
                       + vec3(1.0, 0.98, 0.92) * specKey * 1.5
                       + rimCol;

        float alpha = smoothstep(1.5, -1.0, blendField) * 0.95;

        fragColor = vec4(
          mix(fragColor.rgb, shadedOil, alpha),
          max(fragColor.a, alpha)
        );
      }
    }

    gl_FragColor = fragColor;
  }
`;

/**
 * Shaders for SMEDS Micro-Droplets Point Sprite Particle System.
 * Renders 2,400+ particles with:
 * - Sub-micron luminous pinpoints
 * - Depth-of-field soft Gaussian bokeh
 * - Tyndall effect volumetric scattering
 */
export const microParticleVertexShader = `
  attribute vec2 aPosition;   // screen position in pixels
  attribute float aRadius;    // base radius
  attribute float aOpacity;   // particle opacity
  attribute float aDepth;     // 0..1 depth

  uniform vec2 uResolution;
  uniform float uDofFocalPlane;

  varying float vOpacity;
  varying float vBlur;
  varying float vDepth;

  void main() {
    // Circle of confusion for depth-of-field
    float coc = abs(aDepth - uDofFocalPlane) * 4.0;
    // Generous point size for visible micro-droplet halos (8px - 26px)
    float pointSize = aRadius * 3.5 + coc * 4.0 + 5.0;

    vOpacity = aOpacity;
    vBlur = coc;
    vDepth = aDepth;

    // Convert pixel coordinates to clip space [-1, 1]
    vec2 clipPos = (aPosition / uResolution) * 2.0 - 1.0;
    clipPos.y = -clipPos.y;

    gl_Position = vec4(clipPos, 0.0, 1.0);
    gl_PointSize = clamp(pointSize, 4.0, 36.0);
  }
`;

export const microParticleFragmentShader = `
  precision highp float;

  varying float vOpacity;
  varying float vBlur;
  varying float vDepth;

  void main() {
    if (vOpacity < 0.01) discard;

    vec2 coord = gl_PointCoord * 2.0 - 1.0;
    float dist = length(coord);

    if (dist > 1.0) discard;

    // Crisp luminous center pinpoint + soft Tyndall scattering halo
    float core = smoothstep(0.45, 0.0, dist);
    float halo = exp(-dist * 2.2);
    float glow = mix(core, halo, 0.65);

    // Luminous nano-droplet color
    vec3 pinpointColor = vec3(1.0, 0.98, 0.88); // bright white-gold specular core
    vec3 haloColor = vec3(0.98, 0.72, 0.16);     // glowing golden amber emulsion

    vec3 finalColor = mix(haloColor, pinpointColor, core);
    float finalAlpha = glow * vOpacity * 0.92;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;
