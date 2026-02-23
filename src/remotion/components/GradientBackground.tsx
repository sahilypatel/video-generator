import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

type SceneVariant = "intro" | "hook" | "solution" | "feature" | "cta";

interface GradientBackgroundProps {
  accentColor?: string;
  variant?: SceneVariant;
}

const VARIANTS: Record<SceneVariant, { angle: number; secondary: string; orbScale: number }> = {
  intro: { angle: 135, secondary: "#0d0d1a", orbScale: 1 },
  hook: { angle: 160, secondary: "#0a0a18", orbScale: 1.2 },
  solution: { angle: 120, secondary: "#0d0d1a", orbScale: 0.9 },
  feature: { angle: 180, secondary: "#080816", orbScale: 1.1 },
  cta: { angle: 145, secondary: "#0e0a16", orbScale: 1.4 },
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  accentColor = "#FF8C68",
  variant = "intro",
}) => {
  const frame = useCurrentFrame();
  const v = VARIANTS[variant];

  const orb1X = interpolate(frame, [0, 300], [15, 28], { extrapolateRight: "clamp" });
  const orb1Y = interpolate(frame, [0, 300], [18, 32], { extrapolateRight: "clamp" });
  const orb2X = interpolate(frame, [0, 300], [78, 62], { extrapolateRight: "clamp" });
  const orb2Y = interpolate(frame, [0, 300], [72, 58], { extrapolateRight: "clamp" });

  const breathe = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.92, 1.08]
  );

  const angleShift = interpolate(frame, [0, 300], [v.angle, v.angle + 15], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angleShift}deg, #060610 0%, ${v.secondary} 50%, #10101e 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Primary accent orb */}
      <div
        style={{
          position: "absolute",
          width: 600 * v.orbScale,
          height: 600 * v.orbScale,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}30 0%, ${accentColor}10 40%, transparent 70%)`,
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(50px)",
        }}
      />
      {/* Secondary warm orb */}
      <div
        style={{
          position: "absolute",
          width: 450 * v.orbScale,
          height: 450 * v.orbScale,
          borderRadius: "50%",
          background: `radial-gradient(circle, #FF5E6820 0%, #FF5E6808 40%, transparent 70%)`,
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          transform: `translate(-50%, -50%) scale(${breathe * 0.95})`,
          filter: "blur(70px)",
        }}
      />
      {/* Tertiary cool orb for depth */}
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, #6366f118 0%, transparent 70%)`,
          left: `${50 + Math.sin(frame * 0.015) * 8}%`,
          top: `${50 + Math.cos(frame * 0.012) * 6}%`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />
      {/* Dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Subtle vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
