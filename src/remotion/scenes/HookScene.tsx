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

interface HookSceneProps {
  hook: string;
  problem: string;
  accentColor: string;
}

export const HookScene: React.FC<HookSceneProps> = ({
  hook,
  problem,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const hookScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const scaleValue = interpolate(hookScale, [0, 1], [0.94, 1]);

  // Accent line
  const lineProgress = interpolate(frame, [38, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineWidth = lineProgress * 200;
  const lineOpacity = interpolate(frame, [36, 44], [0, 1], {
    extrapolateRight: "clamp",
  });

  const exitProgress = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
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
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={18} color="rgba(255,255,255,0.25)" seed={7} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 40,
        }}
      >
        {/* Hook text — word-by-word */}
        <div style={{ transform: `scale(${scaleValue})` }}>
          <h2
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: -2.5,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            <AnimatedText
              split="word"
              staggerFrames={5}
              durationPerUnit={20}
              delay={5}
              yOffset={35}
              blurAmount={6}
            >
              {hook}
            </AnimatedText>
          </h2>
        </div>

        {/* Problem text — word-by-word, more breathing room */}
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            letterSpacing: -0.3,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 800,
          }}
        >
          <AnimatedText
              split="word"
              staggerFrames={2}
              durationPerUnit={20}
              delay={30}
              yOffset={18}
              blurAmount={3}
            >
              {problem}
            </AnimatedText>
        </p>

        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            borderRadius: 1,
            opacity: lineOpacity,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
