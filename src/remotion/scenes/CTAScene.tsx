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

interface CTASceneProps {
  companyName: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
}

export const CTAScene: React.FC<CTASceneProps> = ({
  companyName,
  cta,
  websiteUrl,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic radial glow that pulses
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.2, 0.5]
  );
  const glowScale = interpolate(frame, [0, 60], [1.15, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Converging lines
  const lineProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Button animation
  const buttonSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const buttonScale = interpolate(buttonSpring, [0, 1], [0.8, 1]);
  const buttonOpacity = interpolate(frame, [25, 38], [0, 1], {
    extrapolateRight: "clamp",
  });
  const buttonGlow = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.4, 0.8]
  );

  // URL
  const urlOpacity = interpolate(frame, [40, 52], [0, 1], {
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(
    spring({ frame: frame - 40, fps, config: { damping: 200 } }),
    [0, 1],
    [16, 0]
  );

  // Orbiting accent dots
  const orbitAngle = frame * 1.5;

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />

      {/* Big radial spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 48%, ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          transform: `scale(${glowScale})`,
          pointerEvents: "none",
        }}
      />

      <FloatingParticles count={40} color={`${accentColor}50`} maxSize={5} seed={99} />
      <Noise opacity={0.03} />

      {/* Converging accent lines */}
      {[0, 1, 2, 3].map((i) => {
        const angle = 45 + i * 90;
        const len = lineProgress * 400;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: len,
              height: 1.5,
              background: `linear-gradient(90deg, transparent, ${accentColor}55)`,
              transformOrigin: "0 50%",
              transform: `rotate(${angle}deg) translateX(120px)`,
              opacity: lineProgress * 0.4,
            }}
          />
        );
      })}

      {/* Orbiting dots */}
      {[0, 1, 2].map((i) => {
        const a = ((orbitAngle + i * 120) * Math.PI) / 180;
        const radius = 260;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius * 0.4;
        const dotOpacity = interpolate(frame, [10, 25], [0, 0.6], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
              opacity: dotOpacity,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 36,
        }}
      >
        {/* CTA headline — word-by-word */}
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 92,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3.5,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={5}
            durationPerUnit={22}
            delay={8}
            yOffset={45}
            blurAmount={8}
          >
            {cta}
          </AnimatedText>
        </h2>

        {/* CTA Button */}
        <div
          style={{
            transform: `scale(${buttonScale})`,
            opacity: buttonOpacity,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, #FF5E68 100%)`,
              borderRadius: 22,
              padding: "22px 64px",
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              boxShadow: `0 20px 60px ${accentColor}${Math.round(buttonGlow * 255).toString(16).padStart(2, "0")}, 0 0 120px ${accentColor}22`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                letterSpacing: -0.5,
              }}
            >
              {cta}
            </span>
            <span style={{ fontSize: 24, color: "white" }}>→</span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            transform: `translateY(${urlY}px)`,
            opacity: urlOpacity,
          }}
        >
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 500,
              color: `${accentColor}bb`,
              margin: 0,
              letterSpacing: 1,
            }}
          >
            {websiteUrl}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
