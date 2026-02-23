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
import { Noise } from "../components/Noise";
import { FeatureIcon } from "../components/FeatureIcon";

interface FeatureSceneProps {
  featureIndex: number;
  totalFeatures: number;
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}

export const FeatureScene: React.FC<FeatureSceneProps> = ({
  featureIndex,
  totalFeatures,
  icon,
  title,
  description,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Icon entrance with bounce
  const iconSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0.2, 1]);
  const iconRotation = interpolate(iconSpring, [0, 1], [-30, 0]);
  const iconOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow ring behind icon
  const glowRingScale = spring({
    frame: frame - 3,
    fps,
    config: { damping: 200 },
  });
  const glowRingOpacity = interpolate(frame, [3, 15, 35, 50], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Feature number indicator — frame-driven widths (NO CSS transitions!)
  const indicatorProgress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Progress bar at bottom
  const barProgress = interpolate(frame, [25, durationInFrames - 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const exitProgress = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
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
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      {/* Feature number dots — top right */}
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 72,
          display: "flex",
          gap: 8,
          opacity: indicatorProgress * 0.6,
        }}
      >
        {Array.from({ length: totalFeatures }).map((_, i) => {
          const isActive = i === featureIndex;
          const dotWidth = interpolate(
            indicatorProgress,
            [0, 1],
            [8, isActive ? 32 : 8]
          );
          return (
            <div
              key={i}
              style={{
                width: dotWidth,
                height: 8,
                borderRadius: 4,
                background: isActive ? accentColor : "rgba(255,255,255,0.25)",
              }}
            />
          );
        })}
      </div>

      {/* Feature counter label */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 72,
          opacity: indicatorProgress * 0.4,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Feature {featureIndex + 1}/{totalFeatures}
        </span>
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 140px",
          gap: 32,
        }}
      >
        {/* Glow ring behind icon */}
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`,
            transform: `scale(${glowRingScale * 1.5})`,
            opacity: glowRingOpacity,
            filter: "blur(20px)",
          }}
        />

        {/* Icon */}
        <div
          style={{
            transform: `scale(${iconScale}) rotate(${iconRotation}deg)`,
            opacity: iconOpacity,
          }}
        >
          <FeatureIcon icon={icon} accentColor={accentColor} size={120} />
        </div>

        {/* Title — character-by-character */}
        <h3
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 76,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3,
            margin: 0,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={5}
            durationPerUnit={20}
            delay={10}
            yOffset={35}
            blurAmount={5}
          >
            {title}
          </AnimatedText>
        </h3>

        {/* Description — word-by-word */}
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            lineHeight: 1.6,
            letterSpacing: -0.2,
            margin: 0,
            maxWidth: 680,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={2}
            durationPerUnit={18}
            delay={18}
            yOffset={15}
            blurAmount={3}
          >
            {description}
          </AnimatedText>
        </p>

        {/* Animated progress bar */}
        <div
          style={{
            width: 220,
            height: 3,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barProgress * 100}%`,
              background: `linear-gradient(90deg, ${accentColor}, #FF5E68)`,
              borderRadius: 2,
              boxShadow: `0 0 10px ${accentColor}55`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
