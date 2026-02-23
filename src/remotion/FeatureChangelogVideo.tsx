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
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { Ribbon } from "./components/Ribbon";
import { LogoWatermark } from "./components/LogoWatermark";
import { FONT_FAMILY } from "./fonts";

// Frame budget (30 fps):
// Scene 1 Title:      90f   trans:15f
// Scene 2 Features: 420f (3×140f with 2×15f slide transitions inside)
//   Card A: 140f  trans:15f  Card B: 140f  trans:15f  Card C: 140f
//   Net: 420 - 30 = 390     trans:15f into scene 3
// Scene 3 Recap:     120f   trans:15f
// Scene 4 CTA:       120f
// Sum: 90+140+140+140+120+120 = 750
// Trans: 15+15+15+15+15 = 75
// Net: 750 - 75 = 675 frames ≈ 22.5s
export const TEMPLATE_25_FRAMES = 675;

const TRANS = 15;

const DarkChangelogBase: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame * 0.025), [-1, 1], [0.9, 1.1]);

  return (
    <AbsoluteFill style={{ background: "#08080E", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
          left: "70%",
          top: "30%",
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}0a 0%, transparent 70%)`,
          left: "20%",
          bottom: "5%",
          filter: "blur(80px)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 1: Title with Version Badge (90f) ─────────────────────────────
const TitleScene: React.FC<{
  companyName: string;
  accentColor: string;
  logoText?: string;
}> = ({ companyName, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);
  const titleOpacity = interpolate(titleSpring, [0, 0.3], [0, 1]);

  const companyDelay = 30;
  const companyOpacity = interpolate(
    frame,
    [companyDelay, companyDelay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const companyY = interpolate(
    spring({
      frame: frame - companyDelay,
      fps,
      config: { damping: 200 },
    }),
    [0, 1],
    [20, 0],
  );

  const lineWidth = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 120],
  );

  return (
    <AbsoluteFill>
      <DarkChangelogBase accentColor={accentColor} />
      <FloatingParticles count={16} color="rgba(255,255,255,0.06)" seed={25} />
      <Noise opacity={0.03} />

      <Ribbon text="NEW" color={accentColor} delay={5} position="top-right" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 120px",
        }}
      >
        {/* Version badge */}
        <div
          style={{
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            padding: "8px 22px",
            borderRadius: 99,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}35`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 15,
              color: accentColor,
              letterSpacing: 2,
            }}
          >
            v2.0
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 100,
            letterSpacing: -5,
            color: "white",
            textAlign: "center",
            lineHeight: 1.05,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
        >
          What&apos;s New
        </h1>

        <div
          style={{
            width: lineWidth,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            opacity: companyOpacity,
            transform: `translateY(${companyY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accentColor,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {companyName}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Single Feature Card (140f each) ──────────────────────────────────────
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  index: number;
  total: number;
}> = ({ icon, title, description, accentColor, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1 },
  });
  const slideY = interpolate(slideSpring, [0, 1], [400, 0]);
  const cardOpacity = interpolate(slideSpring, [0, 0.4], [0, 1]);

  const iconDelay = 15;
  const iconSpring = spring({
    frame: frame - iconDelay,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

  const titleDelay = 25;
  const titleOpacity = interpolate(
    frame,
    [titleDelay, titleDelay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const descDelay = 40;
  const descOpacity = interpolate(frame, [descDelay, descDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeDelay = 10;
  const badgeSpring = spring({
    frame: frame - badgeDelay,
    fps,
    config: { damping: 10, stiffness: 160 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0, 1]);

  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkChangelogBase accentColor={accentColor} />
      <Noise opacity={0.025} />

      {/* Progress indicator */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 32 : 10,
              height: 10,
              borderRadius: 99,
              background:
                i <= index ? accentColor : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

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
            opacity: cardOpacity,
            transform: `translateY(${slideY}px)`,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: "56px 64px",
            maxWidth: 860,
            width: "100%",
            backdropFilter: "blur(16px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            position: "relative",
          }}
        >
          {/* NEW badge */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              transform: `scale(${badgeScale})`,
              background: "#22C55E",
              borderRadius: 8,
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: 2,
                color: "white",
                textTransform: "uppercase",
              }}
            >
              NEW
            </span>
          </div>

          {/* Icon */}
          <div
            style={{
              transform: `scale(${iconScale})`,
              fontSize: 64,
              lineHeight: 1,
            }}
          >
            {icon}
          </div>

          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 52,
              letterSpacing: -2,
              color: "white",
              textAlign: "center",
              opacity: titleOpacity,
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 600,
              opacity: descOpacity,
            }}
          >
            {description}
          </p>

          {/* Accent line */}
          <div
            style={{
              width: interpolate(
                spring({
                  frame: frame - 50,
                  fps,
                  config: { damping: 200 },
                }),
                [0, 1],
                [0, 160],
              ),
              height: 3,
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Quick Recap (120f) ──────────────────────────────────────────
const RecapScene: React.FC<{
  features: Array<{ icon: string; title: string }>;
  accentColor: string;
}> = ({ features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const displayFeatures = features.slice(0, 3);

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
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
      <DarkChangelogBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 120px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: `${accentColor}aa`,
            opacity: titleOpacity,
          }}
        >
          Everything new in this release
        </span>

        <div
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
          }}
        >
          {displayFeatures.map((feat, i) => {
            const delay = 10 + i * 15;
            const entrySpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 120 },
            });
            const entryScale = interpolate(entrySpring, [0, 1], [0.5, 1]);
            const itemOpacity = interpolate(
              frame,
              [delay, delay + 12],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  transform: `scale(${entryScale})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  padding: "32px 40px",
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${accentColor}18`,
                  minWidth: 220,
                }}
              >
                <div style={{ fontSize: 48, lineHeight: 1 }}>{feat.icon}</div>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: 20,
                    color: "white",
                    textAlign: "center",
                    maxWidth: 180,
                  }}
                >
                  {feat.title}
                </span>
                <div
                  style={{
                    background: "#22C55E",
                    borderRadius: 6,
                    padding: "3px 10px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: 1.5,
                      color: "white",
                      textTransform: "uppercase",
                    }}
                  >
                    NEW
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (120f) ─────────────────────────────────────────────────
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
      <DarkChangelogBase accentColor={accentColor} />
      <FloatingParticles count={22} color={`${accentColor}20`} seed={33} />
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
            fontSize: 82,
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
            Try it now
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
            fontSize: 26,
            padding: "20px 54px",
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
export const FeatureChangelogVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
  } = props;

  const featureList = features.slice(0, 3);
  const paddedFeatures =
    featureList.length < 3
      ? [
          ...featureList,
          ...Array.from({ length: 3 - featureList.length }, (_, i) => ({
            icon: ["🔥", "✨", "🚀"][i % 3],
            title: `Feature ${featureList.length + i + 1}`,
            description: "A powerful new capability",
          })),
        ]
      : featureList;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Title */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <TitleScene
            companyName={companyName}
            accentColor={accentColor}
            logoText={logoText}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 2: Feature Cards */}
        {paddedFeatures.map((feat, i) => (
          <React.Fragment key={`changelog-feat-${i}`}>
            <TransitionSeries.Sequence durationInFrames={140}>
              <FeatureCard
                icon={feat.icon}
                title={feat.title}
                description={feat.description}
                accentColor={accentColor}
                index={i}
                total={paddedFeatures.length}
              />
            </TransitionSeries.Sequence>
            {i < paddedFeatures.length - 1 && (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-bottom" })}
                timing={linearTiming({ durationInFrames: TRANS })}
              />
            )}
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 3: Recap */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <RecapScene features={paddedFeatures} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 4: CTA */}
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
