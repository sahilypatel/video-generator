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
import { wipe } from "@remotion/transitions/wipe";
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { ProgressRing } from "./components/ProgressRing";
import { TypewriterText } from "./components/TypewriterText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { FONT_FAMILY } from "./fonts";

// Frame budget (30 fps):
// Scene 1 Hook:       90f   trans:15f
// Scene 2 Stats:     300f   trans:15f
// Scene 3 Timeline:  150f   trans:15f
// Scene 4 Features:  150f   trans:15f
// Scene 5 Company:    90f   trans:15f
// Scene 6 CTA:       120f
// Sum: 90+300+150+150+90+120 = 900
// Trans: 5×15 = 75
// Net: 900 - 75 = 825 frames ≈ 27.5s
export const TEMPLATE_24_FRAMES = 825;

const TRANS = 15;

const DarkPremiumBase: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame * 0.025), [-1, 1], [0.85, 1.15]);

  return (
    <AbsoluteFill style={{ background: "#06060C", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
          left: "50%",
          top: "40%",
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(120px)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 1: Hook with Typewriter (90f) ──────────────────────────────────
const HookScene: React.FC<{
  hook: string;
  accentColor: string;
}> = ({ hook, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const containerScale = interpolate(containerSpring, [0, 1], [0.92, 1]);

  const lineWidth = interpolate(
    spring({ frame: frame - 5, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 200],
  );

  return (
    <AbsoluteFill>
      <DarkPremiumBase accentColor={accentColor} />
      <FloatingParticles count={16} color="rgba(255,255,255,0.06)" seed={24} />
      <Noise opacity={0.03} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "0 140px",
          transform: `scale(${containerScale})`,
        }}
      >
        <div
          style={{
            width: lineWidth,
            height: 3,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            borderRadius: 2,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.15,
            letterSpacing: -3,
            color: "white",
            textAlign: "center",
          }}
        >
          <TypewriterText
            text={hook}
            delay={5}
            speed={2}
            cursorColor={accentColor}
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 72,
              letterSpacing: -3,
              color: "white",
            }}
          />
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Big Stat Counters (300f = 3×100f) ──────────────────────────
const StatsScene: React.FC<{
  stats: Array<{ label: string; value: string }>;
  accentColor: string;
}> = ({ stats, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const displayStats = stats.slice(0, 3);

  const exit = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkPremiumBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: "0 100px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: `${accentColor}aa`,
            opacity: interpolate(frame, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          By the numbers
        </span>

        {displayStats.map((stat, i) => {
          const segmentStart = i * 100;
          const segmentEnd = segmentStart + 100;
          const isActive = frame >= segmentStart;
          const localFrame = Math.max(0, frame - segmentStart);

          const entrySpring = spring({
            frame: localFrame,
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.9 },
          });
          const entryScale = interpolate(entrySpring, [0, 1], [0.6, 1]);
          const entryOpacity = interpolate(localFrame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const numStr = stat.value.replace(/[^0-9.]/g, "");
          const suffix = stat.value.replace(/[0-9.,]/g, "").trim();
          const target = parseFloat(numStr) || 0;

          if (!isActive) return null;

          return (
            <div
              key={i}
              style={{
                opacity: entryOpacity,
                transform: `scale(${entryScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AnimatedCounter
                targetValue={target}
                suffix={suffix}
                delay={segmentStart}
                fontSize={130}
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: -6,
                  lineHeight: 1,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: accentColor,
                  opacity: interpolate(
                    localFrame,
                    [20, 35],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  ),
                }}
              >
                {stat.label}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Growth Timeline (150f) ──────────────────────────────────────
const TimelineScene: React.FC<{
  awards: string[];
  accentColor: string;
}> = ({ awards, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const milestones = awards.slice(0, 3);

  const lineProgress = interpolate(frame, [5, 80], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkPremiumBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: "0 120px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: `${accentColor}aa`,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Our Journey
        </span>

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1100,
            height: 200,
          }}
        >
          {/* Horizontal line */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 0,
              width: `${lineProgress}%`,
              height: 3,
              background: `linear-gradient(90deg, ${accentColor}60, ${accentColor})`,
              borderRadius: 2,
            }}
          />

          {/* Background line track */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 0,
              width: "100%",
              height: 3,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
            }}
          />

          {/* Milestone dots */}
          {milestones.map((milestone, i) => {
            const dotX = (i / (milestones.length - 1 || 1)) * 100;
            const delay = 20 + i * 25;
            const dotSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 8, stiffness: 180, mass: 0.6 },
            });
            const dotScale = interpolate(dotSpring, [0, 1], [0, 1]);
            const labelOpacity = interpolate(
              frame,
              [delay + 10, delay + 22],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const labelY = interpolate(
              spring({
                frame: frame - delay - 10,
                fps,
                config: { damping: 200 },
              }),
              [0, 1],
              [12, 0],
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${dotX}%`,
                  top: 0,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: accentColor,
                    transform: `scale(${dotScale})`,
                    boxShadow: `0 0 20px ${accentColor}60`,
                    marginTop: 30,
                  }}
                />

                {/* Pulsing ring */}
                <div
                  style={{
                    position: "absolute",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${accentColor}`,
                    top: 30,
                    opacity: interpolate(
                      Math.sin((frame - delay) * 0.12),
                      [-1, 1],
                      [0, 0.4],
                    ),
                    transform: `scale(${dotScale * 1.8})`,
                  }}
                />

                {/* Label */}
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 18,
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    maxWidth: 200,
                    lineHeight: 1.3,
                    opacity: labelOpacity,
                    transform: `translateY(${labelY}px)`,
                    marginTop: 8,
                  }}
                >
                  {milestone}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Feature Grid 2×2 (150f) ────────────────────────────────────
const FeatureGridScene: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  accentColor: string;
}> = ({ features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const displayFeatures = features.slice(0, 4);

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkPremiumBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 140px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            maxWidth: 960,
            width: "100%",
          }}
        >
          {displayFeatures.map((feat, i) => {
            const delay = 10 + i * 20;
            const cardSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 120, mass: 0.8 },
            });
            const cardScale = interpolate(cardSpring, [0, 1], [0.5, 1]);
            const cardOpacity = interpolate(
              frame,
              [delay, delay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${accentColor}18`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}28`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  {feat.icon}
                </div>
                <h4
                  style={{
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: 22,
                    color: "white",
                  }}
                >
                  {feat.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 400,
                    fontSize: 15,
                    color: "rgba(255,255,255,0.42)",
                    lineHeight: 1.4,
                  }}
                >
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* ProgressRing overlay for decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          opacity: interpolate(frame, [40, 55], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <ProgressRing
          progress={92}
          size={100}
          strokeWidth={6}
          color={accentColor}
          delay={40}
          label="Score"
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Company Name + Tagline (90f) ────────────────────────────────
const CompanyScene: React.FC<{
  companyName: string;
  tagline: string;
  accentColor: string;
}> = ({ companyName, tagline, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const nameSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });
  const nameScale = interpolate(nameSpring, [0, 1], [0.8, 1]);
  const nameOpacity = interpolate(nameSpring, [0, 0.3], [0, 1]);

  const tagDelay = 25;
  const tagOpacity = interpolate(frame, [tagDelay, tagDelay + 18], [0, 1], {
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
      <DarkPremiumBase accentColor={accentColor} />
      <FloatingParticles count={20} color={`${accentColor}20`} seed={55} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 100,
            letterSpacing: -5,
            color: "white",
            textAlign: "center",
            opacity: nameOpacity,
            transform: `scale(${nameScale})`,
          }}
        >
          {companyName}
        </h2>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 30,
            color: `${accentColor}cc`,
            textAlign: "center",
            letterSpacing: -0.5,
            opacity: tagOpacity,
          }}
        >
          {tagline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (120f) ─────────────────────────────────────────────────
const CTAScene: React.FC<{
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1]);

  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.04]);

  const urlDelay = 40;
  const urlOpacity = interpolate(frame, [urlDelay, urlDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - fadeOut }}>
      <DarkPremiumBase accentColor={accentColor} />
      <FloatingParticles count={24} color={`${accentColor}22`} seed={77} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          transform: `scale(${entryScale})`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 84,
            letterSpacing: -4,
            color: "white",
            textAlign: "center",
          }}
        >
          <AnimatedText
            split="word"
            animation="slam"
            staggerFrames={5}
            delay={3}
          >
            {cta}
          </AnimatedText>
        </h2>

        <div
          style={{
            transform: `scale(${pulse})`,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}b0)`,
            color: "white",
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 28,
            padding: "20px 56px",
            boxShadow: `0 20px 60px ${accentColor}45`,
          }}
        >
          {cta}
        </div>

        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            color: `${accentColor}cc`,
            fontWeight: 600,
            opacity: urlOpacity,
          }}
        >
          {websiteUrl}
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ─────────────────────────────────────────────────────
export const MetricsGrowthVideo: React.FC<VideoProps> = (props) => {
  const {
    hook,
    companyName,
    tagline,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    stats = [
      { label: "Active users", value: "50,000+" },
      { label: "Average rating", value: "4.9" },
      { label: "Companies", value: "500+" },
    ],
    awards = ["Product of the Year", "Best in Class", "Editor's Choice"],
  } = props;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene hook={hook} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 2: Stats */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <StatsScene stats={stats} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 3: Growth Timeline */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <TimelineScene awards={awards} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 4: Feature Grid */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <FeatureGridScene features={features} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANS,
          })}
        />

        {/* Scene 5: Company */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <CompanyScene
            companyName={companyName}
            tagline={tagline}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 6: CTA */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <CTAScene
            cta={cta}
            websiteUrl={websiteUrl}
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
