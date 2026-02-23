import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
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
import { TypewriterText } from "./components/TypewriterText";

import { CursorPointer } from "./components/CursorPointer";
import { GradientBackground } from "./components/GradientBackground";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { FeatureIcon } from "./components/FeatureIcon";
import { LogoWatermark } from "./components/LogoWatermark";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

// FounderIntro(120) + AppOverview(210) + 4×DemoStep(180) + FeatureRecap(150) + CTA(120)
// minus 7×15 transitions = 105
// = 1320 - 105 = 1215 frames ≈ 40.5s
export const TEMPLATE_19_FRAMES = 1215;

// ─── Scene 1: Founder Intro (4s = 120f) ──────────────────────────────────
const FounderIntroScene: React.FC<{
  companyName: string;
  founderName: string;
  founderTitle: string;
  hook?: string;
  accentColor: string;
  logoText?: string;
}> = ({ companyName, founderName, founderTitle, hook, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const greetSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const greetOpacity = interpolate(greetSpring, [0, 1], [0, 1]);
  const greetY = interpolate(greetSpring, [0, 1], [30, 0]);

  const badgeDelay = 35;
  const badgeSpring = spring({
    frame: frame - badgeDelay,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay, badgeDelay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.85, 1]);

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const hookOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="intro" />
      <FloatingParticles count={16} color="rgba(255,255,255,0.1)" seed={19} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 160px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.1,
            letterSpacing: -3,
            color: "white",
            textAlign: "center",
            opacity: greetOpacity,
            transform: `translateY(${greetY}px)`,
          }}
        >
          <TypewriterText
            text={`Let me show you ${companyName}`}
            delay={8}
            speed={2}
            cursorColor={accentColor}
          />
        </h1>

        {/* Founder badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 100,
            padding: "14px 28px 14px 16px",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}50, ${accentColor}20)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              color: "white",
            }}
          >
            {logoText || companyName.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                fontWeight: 700,
                color: "white",
              }}
            >
              {founderName}
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {founderTitle}
            </span>
          </div>
        </div>
        {hook ? (
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              maxWidth: 600,
              opacity: hookOpacity,
            }}
          >
            {hook}
          </p>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: App Overview (7s = 210f) ───────────────────────────────────
const AppOverviewScene: React.FC<{
  companyName: string;
  tagline: string;
  solution: string;
  problem?: string;
  accentColor: string;
  websiteUrl: string;
}> = ({ companyName, tagline, solution, problem, accentColor, websiteUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slowZoom = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const revealSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1.1 },
  });
  const imgScale = interpolate(revealSpring, [0, 1], [0.9, 1]);
  const imgOpacity = interpolate(frame, [3, 22], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textDelay = 50;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(
    spring({ frame: frame - textDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [25, 0],
  );

  const problemOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={14} color={`${accentColor}25`} seed={42} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "40px 80px",
        }}
      >
        <div
          style={{
            width: 720,
            height: 420,
            borderRadius: 20,
            background: `linear-gradient(145deg, ${accentColor}12 0%, rgba(255,255,255,0.03) 100%)`,
            border: `1px solid ${accentColor}25`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: imgOpacity,
            transform: `scale(${imgScale * slowZoom})`,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: `linear-gradient(135deg, ${accentColor}50, ${accentColor}20)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
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
              fontWeight: 700,
              fontSize: 32,
              color: "white",
              letterSpacing: -1,
            }}
          >
            {companyName}
          </span>
        </div>

        {/* Tagline + solution text */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            maxWidth: 800,
          }}
        >
          {problem ? (
            <p
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                fontWeight: 400,
                color: "rgba(255,255,255,0.35)",
                textAlign: "center",
                maxWidth: 700,
                lineHeight: 1.4,
                opacity: problemOpacity,
              }}
            >
              {problem}
            </p>
          ) : null}
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
            {tagline}
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: -1.5,
              lineHeight: 1.2,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
            }}
          >
            <AnimatedText
              split="word"
              staggerFrames={3}
              durationPerUnit={20}
              delay={textDelay + 10}
              yOffset={18}
              blurAmount={3}
            >
              {solution}
            </AnimatedText>
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Demo Step (6s = 180f each) ──────────────────────────────────
const DemoStepScene: React.FC<{
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  clickX: number;
  clickY: number;
  companyName: string;
  websiteUrl: string;
  accentColor: string;
}> = ({
  stepIndex,
  totalSteps,
  title,
  description,
  clickX,
  clickY,
  companyName,
  websiteUrl,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const contentSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const contentScale = interpolate(contentSpring, [0, 1], [0.94, 1]);
  const contentOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textDelay = 45;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(
    spring({ frame: frame - textDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [20, 0],
  );

  const progressWidth = interpolate(
    frame,
    [20, durationInFrames - 15],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const mockupOffsetX = 420;
  const mockupOffsetY = 180;

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      {/* Step counter top-left */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(frame, [0, 15], [0, 0.8], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 15,
            fontWeight: 800,
            color: "white",
          }}
        >
          {stepIndex + 1}
        </div>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Step {stepIndex + 1} of {totalSteps}
        </span>
      </div>

      {/* Progress dots top-right */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 72,
          display: "flex",
          gap: 8,
        }}
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === stepIndex ? 28 : 8,
              height: 8,
              borderRadius: 99,
              background: i <= stepIndex ? accentColor : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 72px",
          gap: 56,
          transform: `scale(${contentScale})`,
          opacity: contentOpacity,
        }}
      >
        {/* Left: text */}
        <div
          style={{
            flex: "0 0 380px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <h3
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
              delay={textDelay + 5}
              yOffset={22}
            >
              {title}
            </AnimatedText>
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
              fontSize: 22,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.45,
            }}
          >
            <AnimatedText
              split="word"
              staggerFrames={3}
              delay={textDelay + 20}
              yOffset={14}
              blurAmount={3}
            >
              {description}
            </AnimatedText>
          </p>

          {/* Inline progress bar */}
          <div
            style={{
              width: 120,
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              marginTop: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressWidth}%`,
                background: `linear-gradient(90deg, ${accentColor}, #FF5E68)`,
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {/* Right: product placeholder with cursor */}
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <div
            style={{
              width: 680,
              height: 440,
              borderRadius: 14,
              background: `linear-gradient(145deg, ${accentColor}10 0%, rgba(255,255,255,0.02) 100%)`,
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: 0.3,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: `${accentColor}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
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
                  fontSize: 16,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {companyName}
              </span>
            </div>
          </div>

          <CursorPointer
            startX={mockupOffsetX + 200}
            startY={mockupOffsetY + 300}
            endX={mockupOffsetX + clickX * 0.68}
            endY={mockupOffsetY + clickY * 0.68 + 36}
            delay={25}
            clickAtFrame={70}
            accentColor={accentColor}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Feature Recap (5s = 150f) ──────────────────────────────────
const FeatureRecapScene: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  companyName: string;
  accentColor: string;
}> = ({ features, companyName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const displayFeats = features.slice(0, 4);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={18} color={`${accentColor}22`} seed={77} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 120px",
        }}
      >
        <div style={{ opacity: titleOpacity, textAlign: "center" }}>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              fontWeight: 600,
              color: accentColor,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Everything you get with {companyName}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            maxWidth: 920,
            width: "100%",
          }}
        >
          {displayFeats.map((feat, i) => {
            const delay = 12 + i * 12;
            const gridSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 11, stiffness: 120, mass: 0.7 },
            });
            const gridScale = interpolate(gridSpring, [0, 1], [0.5, 1]);
            const gridOpacity = interpolate(
              frame,
              [delay, delay + 12],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={i}
                style={{
                  opacity: gridOpacity,
                  transform: `scale(${gridScale})`,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${accentColor}20`,
                  borderRadius: 20,
                  padding: "26px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <FeatureIcon icon={feat.icon} accentColor={accentColor} size={50} />
                <div>
                  <h4
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 22,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {feat.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 14,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.45)",
                      margin: "4px 0 0",
                      lineHeight: 1.4,
                    }}
                  >
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA (4s = 120f) ────────────────────────────────────────────
const DemoCtaScene: React.FC<{
  cta: string;
  websiteUrl: string;
  companyName: string;
  founderName: string;
  accentColor: string;
}> = ({ cta, websiteUrl, companyName, founderName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryScale = interpolate(
    spring({ frame, fps, config: { damping: 13, stiffness: 120 } }),
    [0, 1],
    [0.9, 1],
  );

  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.03]);

  const urlDelay = 45;
  const urlOpacity = interpolate(frame, [urlDelay, urlDelay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const founderDelay = 60;
  const founderOpacity = interpolate(
    frame,
    [founderDelay, founderDelay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <FloatingParticles count={22} color={`${accentColor}28`} seed={91} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          transform: `scale(${entryScale})`,
          padding: "0 120px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 76,
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

        <div
          style={{
            transform: `scale(${pulse})`,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${accentColor}, #FF5E68)`,
            color: "white",
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 26,
            padding: "18px 48px",
            boxShadow: `0 18px 50px ${accentColor}50`,
          }}
        >
          {cta}
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 20,
            color: `${accentColor}cc`,
            opacity: urlOpacity,
          }}
        >
          {websiteUrl}
        </p>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 400,
            fontSize: 14,
            color: "rgba(255,255,255,0.3)",
            opacity: founderOpacity,
            letterSpacing: 1,
          }}
        >
          — {founderName}, {companyName}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────
export const FounderDemoVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    hook = "",
    problem = "",
    solution,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
    founderName = "Alex Chen",
    founderTitle = "CEO & Co-founder",
    demoSteps = [],
  } = props;

  const defaultDemoSteps = [
    { title: "Create a project", description: "Start with a blank canvas and pick your template" },
    { title: "Customize everything", description: "Drag, drop, and tweak until it's perfect" },
    { title: "Invite your team", description: "Share with one click — everyone gets real-time access" },
    { title: "Ship instantly", description: "Go live to the world with a single button" },
  ];

  const steps = demoSteps.length > 0 ? demoSteps : defaultDemoSteps;
  const paddedSteps =
    steps.length < 4
      ? [
          ...steps,
          ...defaultDemoSteps.slice(steps.length, 4),
        ]
      : steps.slice(0, 4);

  const featureList = features.slice(0, 4);
  const paddedFeatures =
    featureList.length < 4
      ? [
          ...featureList,
          ...Array.from({ length: 4 - featureList.length }, (_, i) => ({
            icon: ["🔧", "📊", "🔒", "🚀"][i % 4],
            title: `Feature ${featureList.length + i + 1}`,
            description: "Powerful capability built for scale",
          })),
        ]
      : featureList;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Founder Intro — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <FounderIntroScene
            companyName={companyName}
            founderName={founderName}
            founderTitle={founderTitle}
            hook={hook}
            accentColor={accentColor}
            logoText={logoText}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* App Overview — 7s */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <AppOverviewScene
            companyName={companyName}
            tagline={tagline}
            solution={solution}
            problem={problem}
            accentColor={accentColor}
            websiteUrl={websiteUrl}
          />
        </TransitionSeries.Sequence>

        {/* Demo Steps — 6s each */}
        {paddedSteps.map((step, index) => (
          <React.Fragment key={`demo-step-${index}`}>
            <TransitionSeries.Transition
              presentation={slide({
                direction: index % 2 === 0 ? "from-right" : "from-left",
              })}
              timing={springTiming({
                config: { damping: 200 },
                durationInFrames: TRANSITION,
              })}
            />
            <TransitionSeries.Sequence durationInFrames={180}>
              <DemoStepScene
                stepIndex={index}
                totalSteps={paddedSteps.length}
                title={step.title}
                description={step.description}
                clickX={500}
                clickY={300}
                companyName={companyName}
                websiteUrl={websiteUrl}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Feature Recap — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <FeatureRecapScene
            features={paddedFeatures}
            companyName={companyName}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* CTA — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <DemoCtaScene
            cta={cta}
            websiteUrl={websiteUrl}
            companyName={companyName}
            founderName={founderName}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark
        logoUrl={logoUrl}
        companyName={companyName}
        accentColor={accentColor}
      />
    </AbsoluteFill>
  );
};
