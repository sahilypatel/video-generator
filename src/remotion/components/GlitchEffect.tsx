import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface GlitchEffectProps {
  children: React.ReactNode;
  intensity?: number;
  seed?: number;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  intensity = 1,
  seed = 0,
}) => {
  const frame = useCurrentFrame();

  const glitchActive =
    pseudoRandom(frame * 0.7 + seed) > 0.6 ||
    (frame > 5 && frame < 12) ||
    (frame > 25 && frame < 30);

  const offsetX = glitchActive
    ? (pseudoRandom(frame * 1.3 + seed) - 0.5) * 12 * intensity
    : 0;

  const rgbSplitR = glitchActive ? 3 * intensity : 0;
  const rgbSplitB = glitchActive ? -3 * intensity : 0;

  const flicker = glitchActive
    ? interpolate(pseudoRandom(frame * 2.1 + seed), [0, 1], [0.85, 1])
    : 1;

  const sliceOffset = glitchActive
    ? (pseudoRandom(frame * 3.7 + seed) - 0.5) * 8 * intensity
    : 0;
  const sliceY = pseudoRandom(frame * 5.3 + seed) * 100;

  return (
    <AbsoluteFill style={{ opacity: flicker }}>
      {/* Red channel offset */}
      <AbsoluteFill
        style={{
          transform: `translateX(${rgbSplitR}px)`,
          mixBlendMode: "screen",
          opacity: glitchActive ? 0.15 : 0,
        }}
      >
        <AbsoluteFill style={{ filter: "saturate(0) brightness(0.5)" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,0,0,0.3)",
              mixBlendMode: "multiply",
            }}
          />
          {children}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Blue channel offset */}
      <AbsoluteFill
        style={{
          transform: `translateX(${rgbSplitB}px)`,
          mixBlendMode: "screen",
          opacity: glitchActive ? 0.15 : 0,
        }}
      >
        <AbsoluteFill style={{ filter: "saturate(0) brightness(0.5)" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,255,0.3)",
              mixBlendMode: "multiply",
            }}
          />
          {children}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Main content with horizontal offset */}
      <AbsoluteFill
        style={{
          transform: `translateX(${offsetX}px)`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Horizontal scan line slice */}
      {glitchActive && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${sliceY}%`,
            height: 3,
            background: `rgba(255,255,255,${0.08 * intensity})`,
            transform: `translateX(${sliceOffset}px)`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
