import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { GradientBackground } from "./components/GradientBackground";
import { LogoWatermark } from "./components/LogoWatermark";
import { Noise } from "./components/Noise";
import { FeatureIcon } from "./components/FeatureIcon";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { SFX } from "./components/SFX";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

// Hook(90) + Problem(150) + Reveal(240) + 3×Feature(165) + Social(180) + CTA(150)
// minus transitions: 15+15+15+12+12+15+15 = 99
// = 1305 - 99 = 1206 frames ≈ 40s
export const TEMPLATE_11_FRAMES = 1206;

// ─── Scene 1: Hook (3s = 90f) ─────────────────────────────────────────────
// spring() physics for headline, scale 0.8→1 with opacity
const PromoHookScene: React.FC<{
  hook: string;
  companyName: string;
  accentColor: string;
}> = ({ hook, companyName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.8 },
  });
  const headlineScale = interpolate(headlineSpring, [0, 1], [0.8, 1]);
  const headlineOpacity = interpolate(headlineSpring, [0, 1], [0, 1]);

  const nameDelay = 30;
  const nameOpacity = interpolate(frame, [nameDelay, nameDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(
    spring({ frame: frame - nameDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [20, 0],
  );

  const flash = interpolate(frame, [2, 5, 10], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={20} color="rgba(255,255,255,0.15)" seed={77} />
      <Noise opacity={0.025} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "0 140px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1.05,
            letterSpacing: -4,
            color: "white",
            textAlign: "center",
            maxWidth: 1200,
            transform: `scale(${headlineScale})`,
            opacity: headlineOpacity,
          }}
        >
          <AnimatedText
            split="word"
            animation="slam"
            staggerFrames={4}
            delay={2}
            yOffset={30}
          >
            {hook}
          </AnimatedText>
        </h1>

        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 2,
              background: accentColor,
              borderRadius: 1,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 16,
              fontWeight: 700,
              color: accentColor,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {companyName}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem Statement (5s = 150f) ───────────────────────────────
// Words fade in word-by-word, subtle shake, red flash accent
const ProblemScene: React.FC<{
  problem: string;
  accentColor: string;
}> = ({ problem, accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const shakePhase = Math.sin(frame * 0.8) * Math.max(0, 1 - frame / 40);
  const shakeX = shakePhase * 4;

  const redFlash = interpolate(frame, [50, 58, 70], [0, 0.12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const borderFlash = interpolate(frame, [50, 58, 70], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="intro" />
      <Noise opacity={0.025} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FF2D2D",
          opacity: redFlash,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 160px",
          transform: `translateX(${shakeX}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            border: `2px solid ${interpolate(borderFlash, [0, 1], [0.08, 0.5])
              .toFixed(2)
              .replace("0.", "rgba(255,60,60,0.")}`,
            borderColor: `rgba(255,60,60,${interpolate(borderFlash, [0, 1], [0, 0.5]).toFixed(2)})`,
            background: "rgba(0,0,0,0.25)",
            padding: "52px 64px",
            maxWidth: 1100,
          }}
        >
          <p
            style={{
              margin: "0 0 16px 0",
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255,100,100,0.8)",
            }}
          >
            The problem
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 60,
              letterSpacing: -2.5,
              lineHeight: 1.12,
              color: "white",
            }}
          >
            <AnimatedText
              split="word"
              staggerFrames={5}
              durationPerUnit={18}
              delay={10}
              yOffset={22}
              blurAmount={5}
            >
              {problem}
            </AnimatedText>
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Product Reveal (8s = 240f) ─────────────────────────────────
// 3D perspective tilt, expanding drop shadow, spring bounce-settle
const ProductRevealScene: React.FC<{
  companyName: string;
  tagline: string;
  solution: string;
  accentColor: string;
  websiteUrl: string;
}> = ({ companyName, tagline, solution, accentColor, websiteUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const revealSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1.2 },
  });

  const rotateY = interpolate(revealSpring, [0, 1], [25, 0]);
  const shadowSpread = interpolate(revealSpring, [0, 1], [10, 60]);
  const shadowOpacity = interpolate(revealSpring, [0, 1], [0.1, 0.5]);
  const imgScale = interpolate(revealSpring, [0, 1], [0.88, 1]);
  const imgOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateRight: "clamp",
  });

  const slowFloat = Math.sin(frame * 0.025) * 6;

  const textDelay = 60;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(
    spring({
      frame: frame - textDelay,
      fps,
      config: { damping: 200 },
    }),
    [0, 1],
    [30, 0],
  );

  const solutionDelay = textDelay + 25;
  const solutionOpacity = interpolate(
    frame,
    [solutionDelay, solutionDelay + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const taglineFadeStart = 90;
  const taglineOpacity = interpolate(
    frame,
    [taglineFadeStart, taglineFadeStart + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={18} color={`${accentColor}30`} seed={33} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 72,
          padding: "0 80px",
        }}
      >
        <div
            style={{
              perspective: 1200,
              flex: "0 0 auto",
            }}
          >
            <div
              style={{
                width: 580,
                height: 400,
                borderRadius: 28,
                background: `linear-gradient(145deg, ${accentColor}18 0%, rgba(255,255,255,0.04) 100%)`,
                border: `1px solid ${accentColor}30`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                opacity: imgOpacity,
                transform: `rotateY(${rotateY}deg) scale(${imgScale}) translateY(${slowFloat}px)`,
                transformStyle: "preserve-3d",
                boxShadow: `0 ${shadowSpread}px ${shadowSpread * 2}px rgba(0,0,0,${shadowOpacity}), 0 0 ${shadowSpread * 1.5}px ${accentColor}20`,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 28,
                  background: `linear-gradient(135deg, ${accentColor}50, ${accentColor}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 44,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {companyName.slice(0, 2).toUpperCase()}
              </div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 800,
                  fontSize: 42,
                  color: "white",
                  letterSpacing: -2,
                }}
              >
                {companyName}
              </span>
            </div>
          </div>

        <div
          style={{
            flex: "0 0 420px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            Introducing
          </p>
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 52,
              letterSpacing: -2,
              lineHeight: 1.1,
              color: "white",
            }}
          >
            <AnimatedText
              split="word"
              staggerFrames={4}
              durationPerUnit={20}
              delay={textDelay + 5}
              yOffset={20}
            >
              {companyName}
            </AnimatedText>
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
              fontSize: 22,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.4,
              opacity: solutionOpacity,
            }}
          >
            {solution}
          </p>
          {tagline && (
            <p
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontWeight: 400,
                fontSize: 22,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.4,
                maxWidth: 700,
                textAlign: "center",
                opacity: taglineOpacity,
              }}
            >
              {tagline}
            </p>
          )}
          <div
            style={{
              width: interpolate(frame, [textDelay + 30, textDelay + 60], [0, 80], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }),
              height: 3,
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Feature Highlight (5.5s = 165f each) ──────────────────────
// Slide in from right with spring(), SVG checkmark stroke, number counter
const PromoFeatureScene: React.FC<{
  index: number;
  total: number;
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}> = ({ index, total, icon, title, description, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });
  const slideX = interpolate(slideSpring, [0, 1], [200, 0]);
  const cardOpacity = interpolate(slideSpring, [0, 1], [0, 1]);

  const iconDelay = 12;
  const iconSpring = spring({
    frame: frame - iconDelay,
    fps,
    config: { damping: 11, stiffness: 150 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0.3, 1]);

  const checkDelay = 25;
  const checkStroke = interpolate(frame, [checkDelay, checkDelay + 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numMatch = description.match(/(\d[\d,]*)/);
  const hasNumber = !!numMatch;
  const targetNum = hasNumber ? parseInt(numMatch![1].replace(/,/g, ""), 10) : 0;
  const countDisplay = hasNumber
    ? Math.round(
        interpolate(frame, [20, 80], [0, targetNum], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }),
      )
    : 0;

  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      {/* Feature indicator pills */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 72,
          color: accentColor,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.8,
        }}
      >
        Feature {index + 1} of {total}
      </div>
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 72,
          display: "flex",
          gap: 8,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 30 : 8,
              height: 8,
              borderRadius: 99,
              background: i <= index ? accentColor : "rgba(255,255,255,0.18)",
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            opacity: cardOpacity,
            transform: `translateX(${slideX}px)`,
            maxWidth: 1100,
          }}
        >
          {/* Icon with checkmark ring */}
          <div style={{ position: "relative", flex: "0 0 auto" }}>
            <div style={{ transform: `scale(${iconScale})` }}>
              <FeatureIcon icon={icon} accentColor={accentColor} size={110} />
            </div>
            {/* Animated check ring */}
            <svg
              width="130"
              height="130"
              viewBox="0 0 130 130"
              style={{
                position: "absolute",
                top: -10,
                left: -10,
              }}
            >
              <circle
                cx="65"
                cy="65"
                r="62"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeDasharray="30"
                strokeDashoffset={checkStroke}
                opacity={0.5}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Feature text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: 1,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 62,
                letterSpacing: -2.5,
                lineHeight: 1.08,
                color: "white",
              }}
            >
              <AnimatedText
                split="word"
                staggerFrames={4}
                delay={8}
                yOffset={20}
              >
                {title}
              </AnimatedText>
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                fontSize: 24,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.4,
                maxWidth: 600,
              }}
            >
              {hasNumber ? (
                <>
                  <AnimatedText
                    split="word"
                    staggerFrames={3}
                    delay={20}
                    yOffset={12}
                    blurAmount={3}
                  >
                    {description.replace(
                      numMatch![0],
                      countDisplay.toLocaleString(),
                    )}
                  </AnimatedText>
                </>
              ) : (
                <AnimatedText
                  split="word"
                  staggerFrames={3}
                  delay={20}
                  yOffset={12}
                  blurAmount={3}
                >
                  {description}
                </AnimatedText>
              )}
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Social Proof (6s = 180f) ───────────────────────────────────
// Logo wall staggered fade, testimonial card flips in with Y rotation
const SocialProofScene: React.FC<{
  proofMetric: string;
  proofLogos: string[];
  testimonialQuote: string;
  testimonialAuthor: string;
  accentColor: string;
}> = ({ proofMetric, proofLogos, testimonialQuote, testimonialAuthor, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const metricNum = proofMetric.replace(/[^0-9]/g, "");
  const metricSuffix = proofMetric.replace(/[0-9,]/g, "").trim();
  const target = parseInt(metricNum, 10) || 500;
  const metricDisplay = Math.round(
    interpolate(frame, [0, 60], [0, target], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  const metricScale = interpolate(
    spring({ frame, fps, config: { damping: 12, stiffness: 120 } }),
    [0, 1],
    [0.85, 1],
  );

  // Testimonial card flip (Y-axis rotation)
  const cardDelay = 65;
  const cardFlip = interpolate(
    spring({
      frame: frame - cardDelay,
      fps,
      config: { damping: 14, stiffness: 80, mass: 1 },
    }),
    [0, 1],
    [90, 0],
  );
  const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={14} color={`${accentColor}33`} seed={55} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 140px",
        }}
      >
        {/* Metric counter */}
        <div style={{ transform: `scale(${metricScale})`, textAlign: "center" }}>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            Trusted by
          </span>
          <h2
            style={{
              margin: "8px 0 0",
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 100,
              letterSpacing: -4,
              lineHeight: 1,
              color: "white",
            }}
          >
            {metricDisplay.toLocaleString()}
            {metricSuffix}
          </h2>
        </div>

        {/* Logo wall — staggered fade (offset ~5 frames each) */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {proofLogos.slice(0, 5).map((logo, i) => {
            const logoDelay = 40 + i * 5;
            const logoOpacity = interpolate(
              frame,
              [logoDelay, logoDelay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const logoY = interpolate(
              frame,
              [logoDelay, logoDelay + 15],
              [14, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={logo}
                style={{
                  opacity: logoOpacity,
                  transform: `translateY(${logoY}px)`,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "12px 24px",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {logo}
              </div>
            );
          })}
        </div>

        {/* Testimonial card with Y-axis flip */}
        {testimonialQuote && (
          <div
            style={{
              perspective: 800,
              marginTop: 8,
            }}
          >
            <div
              style={{
                opacity: cardOpacity,
                transform: `rotateY(${cardFlip}deg)`,
                transformStyle: "preserve-3d",
                borderRadius: 20,
                border: `1px solid ${accentColor}30`,
                background: "rgba(255,255,255,0.04)",
                padding: "28px 40px",
                maxWidth: 700,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 24,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.4,
                }}
              >
                &ldquo;{testimonialQuote}&rdquo;
              </p>
              <p
                style={{
                  margin: "14px 0 0",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 16,
                  color: accentColor,
                }}
              >
                — {testimonialAuthor}
              </p>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (5s = 150f) ────────────────────────────────────────────
// Pulsing button with Math.sin, glow halo radiating outward
const PromoCtaScene: React.FC<{
  cta: string;
  websiteUrl: string;
  companyName: string;
  accentColor: string;
}> = ({ cta, websiteUrl, companyName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryScale = interpolate(
    spring({ frame, fps, config: { damping: 13, stiffness: 120 } }),
    [0, 1],
    [0.9, 1],
  );

  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [1, 1.04]);

  const haloScale = interpolate(
    (frame % 60) / 60,
    [0, 1],
    [0.95, 1.6],
  );
  const haloOpacity = interpolate(
    (frame % 60) / 60,
    [0, 0.3, 1],
    [0.3, 0.15, 0],
  );

  const urlDelay = 50;
  const urlOpacity = interpolate(frame, [urlDelay, urlDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <FloatingParticles count={24} color={`${accentColor}28`} seed={99} />
      <Noise opacity={0.025} />
      <ConfettiBurst triggerFrame={5} accentColor={accentColor} count={40} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          transform: `scale(${entryScale})`,
          padding: "0 120px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 82,
            letterSpacing: -3,
            lineHeight: 1.06,
            color: "white",
            textAlign: "center",
          }}
        >
          <AnimatedText
            split="word"
            animation="slam"
            staggerFrames={4}
            delay={4}
          >
            {cta}
          </AnimatedText>
        </h2>

        {/* Pulsing button with glow halo */}
        <div style={{ position: "relative" }}>
          {/* Radiating halo */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 200,
              height: 60,
              borderRadius: 20,
              border: `2px solid ${accentColor}`,
              transform: `translate(-50%, -50%) scale(${haloScale})`,
              opacity: haloOpacity,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              transform: `scale(${pulse})`,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${accentColor}, #FF5E68)`,
              color: "white",
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 28,
              padding: "20px 52px",
              boxShadow: `0 20px 60px ${accentColor}50`,
            }}
          >
            {cta}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 22,
            color: `${accentColor}cc`,
            opacity: urlOpacity,
          }}
        >
          {websiteUrl}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────
export const ProductPromoVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    hook,
    problem,
    solution,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    proofMetric = "500+ teams",
    proofLogos = ["Notion", "Vercel", "Stripe"],
    testimonialQuote = "This changed everything for our launch day.",
    testimonialAuthor = "CEO @ Shipfast",
  } = props;

  const featureList = features.slice(0, 3);

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Hook — 3s */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <PromoHookScene
            hook={hook}
            companyName={companyName}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION,
          })}
        />

        {/* Problem Statement — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <ProblemScene problem={problem} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Product Reveal — 8s */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <ProductRevealScene
            companyName={companyName}
            tagline={tagline}
            solution={solution}
            accentColor={accentColor}
            websiteUrl={websiteUrl}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION,
          })}
        />

        {/* Feature Highlights — 5.5s each */}
        {featureList.map((feature, index) => (
          <React.Fragment key={`promo-feat-${index}`}>
            <TransitionSeries.Sequence durationInFrames={165}>
              <PromoFeatureScene
                index={index}
                total={featureList.length}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>
            {index < featureList.length - 1 && (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: 12 })}
              />
            )}
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Social Proof — 6s */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SocialProofScene
            proofMetric={proofMetric}
            proofLogos={proofLogos}
            testimonialQuote={testimonialQuote}
            testimonialAuthor={testimonialAuthor}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* CTA — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <PromoCtaScene
            cta={cta}
            websiteUrl={websiteUrl}
            companyName={companyName}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark
        logoUrl={logoUrl}
        companyName={companyName}
        accentColor={accentColor}
      />

      {(props.sfxEnabled ?? true) && (
        <>
          <SFX type="impact" frame={5} />
          <SFX type="whoosh" frame={75} />
          <SFX type="whoosh" frame={210} />
          <SFX type="pop" frame={445} />
          <SFX type="pop" frame={598} />
          <SFX type="pop" frame={751} />
          <SFX type="whoosh" frame={891} />
          <SFX type="ding" frame={1060} />
        </>
      )}
      {(props.musicTrack ?? "ambient") !== "none" && (
        <BackgroundMusic
          track={(props.musicTrack as "ambient" | "upbeat" | "cinematic") ?? "ambient"}
          volume={props.musicVolume ?? 0.15}
        />
      )}
    </AbsoluteFill>
  );
};
