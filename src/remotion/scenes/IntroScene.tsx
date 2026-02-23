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

interface IntroSceneProps {
  companyName: string;
  tagline: string;
  accentColor: string;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  companyName,
  tagline,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const lineWidth = interpolate(frame, [5, 40], [0, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const lineOpacity = interpolate(frame, [3, 12], [0, 1], {
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
      <GradientBackground accentColor={accentColor} variant="intro" />
      <FloatingParticles count={25} color={`${accentColor}60`} seed={1} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* "Introducing" label */}
        <div
          style={{
            opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(spring({ frame, fps, config: { damping: 200 } }), [0, 1], [14, 0])}px)`,
          }}
        >
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
        </div>

        {/* Company name — character reveal */}
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 90,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3,
            margin: 0,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          <AnimatedText
            split="character"
            staggerFrames={3}
            durationPerUnit={22}
            delay={12}
            yOffset={40}
            blurAmount={6}
          >
            {companyName}
          </AnimatedText>
        </h1>

        {/* Divider line */}
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            borderRadius: 1,
            opacity: lineOpacity,
          }}
        />

        {/* Tagline — word-by-word */}
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 30,
            fontWeight: 500,
            color: "rgba(255,255,255,0.65)",
            margin: 0,
            textAlign: "center",
            letterSpacing: -0.5,
            maxWidth: 800,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={4}
            durationPerUnit={20}
            delay={24}
            yOffset={20}
            blurAmount={4}
          >
            {tagline}
          </AnimatedText>
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
