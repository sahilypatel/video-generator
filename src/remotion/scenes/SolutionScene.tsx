import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { FONT_FAMILY } from "../fonts";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { FloatingParticles } from "../components/FloatingParticles";
import { Noise } from "../components/Noise";

interface SolutionSceneProps {
  companyName: string;
  solution: string;
  accentColor: string;
  logoText?: string;
}

export const SolutionScene: React.FC<SolutionSceneProps> = ({
  companyName,
  solution,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // "Introducing" label
  const labelOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1],
    [18, 0]
  );

  // Left line
  const leftLineWidth = interpolate(frame, [0, 20], [0, 44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Right line
  const rightLineWidth = interpolate(frame, [0, 20], [0, 44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Headline
  const headlineSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const headlineScale = interpolate(headlineSpring, [0, 1], [0.85, 1]);

  // Badge
  const badgeOpacity = interpolate(frame, [42, 55], [0, 1], {
    extrapolateRight: "clamp",
  });
  const badgeScale = spring({
    frame: frame - 42,
    fps,
    config: { damping: 18, stiffness: 180 },
  });

  // Glow pulse behind headline
  const glowIntensity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.15, 0.35]
  );

  const exitProgress = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const exitOpacity = 1 - exitProgress;
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.97]);

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
      }}
    >
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={20} color={`${accentColor}50`} seed={21} />
      <Noise opacity={0.02} />

      {/* Glow behind headline */}
      <div
        style={{
          position: "absolute",
          width: "60%",
          height: "40%",
          left: "20%",
          top: "30%",
          background: `radial-gradient(ellipse, ${accentColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 30,
        }}
      >
        {/* "Introducing" label */}
        <div
          style={{
            transform: `translateY(${labelY}px)`,
            opacity: labelOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: leftLineWidth,
              height: 1.5,
              background: `linear-gradient(90deg, transparent, ${accentColor})`,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 15,
              fontWeight: 600,
              color: accentColor,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Introducing
          </span>
          <div
            style={{
              width: rightLineWidth,
              height: 1.5,
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            }}
          />
        </div>

        {/* Company name as gradient headline */}
        <div style={{ transform: `scale(${headlineScale})` }}>
          <h2
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 110,
              fontWeight: 800,
              margin: 0,
              textAlign: "center",
              letterSpacing: -4,
              lineHeight: 1,
              background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 55%, #FF5E68 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: interpolate(frame, [14, 34], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(
                spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 100 } }),
                [0, 1],
                [50, 0]
              )}px)`,
            }}
          >
            {companyName}
          </h2>
        </div>

        {/* Solution description — word-by-word */}
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            lineHeight: 1.6,
            letterSpacing: -0.2,
            margin: 0,
            maxWidth: 760,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={2}
            durationPerUnit={18}
            delay={18}
            yOffset={16}
            blurAmount={3}
          >
            {solution}
          </AnimatedText>
        </p>

        {/* Badge */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            opacity: badgeOpacity,
            background: `linear-gradient(135deg, ${accentColor}18, #FF5E6818)`,
            border: `1px solid ${accentColor}33`,
            borderRadius: 100,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}, #FF5E68)`,
              boxShadow: `0 0 10px ${accentColor}88`,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: 0.5,
            }}
          >
            Available now
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
