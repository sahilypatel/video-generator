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
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { FeatureIcon } from "./components/FeatureIcon";
import { TypewriterText } from "./components/TypewriterText";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 16;

// HeroWord(120) + Differentiator(150) + Feature1(135) + Feature2(135) + Feature3(135) + CTA(150) - 5×16 = 745
export const TEMPLATE_10_FRAMES = 745;

const BG = "#0A0A0A";

// ─── Scene 1: Hero Word (4s = 120f) ─────────────────────────────────────
const HeroWordScene: React.FC<{
  heroWord: string;
  hook: string;
  accentColor: string;
}> = ({ heroWord, hook, accentColor }) => {
  const frame = useCurrentFrame();

  const lineExpand = interpolate(frame, [55, 85], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: BG,
      }}
    >
      <Noise opacity={0.015} />

      <div
        style={{
          position: "absolute",
          width: "40%",
          height: "40%",
          left: "30%",
          top: "30%",
          background: `radial-gradient(ellipse, ${accentColor}08 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 200,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -10,
            lineHeight: 0.9,
            color: "white",
            textAlign: "center",
          }}
        >
          <TypewriterText
            text={heroWord}
            delay={15}
            speed={4}
            cursorColor={accentColor}
          />
        </h1>

        <div
          style={{
            width: lineExpand,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            borderRadius: 1,
            marginTop: 20,
            opacity: interpolate(frame, [50, 65], [0, 0.8], { extrapolateRight: "clamp" }),
          }}
        />

        {hook && (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
              margin: "16px 0 0",
              textAlign: "center",
              opacity: interpolate(frame, [70, 88], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {hook}
          </p>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Differentiator (5s = 150f) ────────────────────────────────
const DifferentiatorScene: React.FC<{
  differentiator: string;
  companyName: string;
  tagline: string;
  problem: string;
  accentColor: string;
}> = ({ differentiator, companyName, tagline, problem, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const nameDelay = 60;
  const nameOpacity = interpolate(frame, [nameDelay, nameDelay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(
    spring({ frame: frame - nameDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [15, 0]
  );

  const problemOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [75, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Noise opacity={0.015} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 200px",
          gap: 40,
          opacity: contentOpacity,
        }}
      >
        {problem && (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 16,
              fontWeight: 400,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 3,
              textTransform: "uppercase",
              margin: 0,
              textAlign: "center",
              opacity: problemOpacity,
            }}
          >
            {problem}
          </p>
        )}
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            letterSpacing: -1.5,
            lineHeight: 1.25,
            margin: 0,
            maxWidth: 900,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={22} delay={10} yOffset={20} blurAmount={4}>
            {differentiator}
          </AnimatedText>
        </h2>

        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 2,
              background: accentColor,
              borderRadius: 1,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 600,
              color: accentColor,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {companyName}
          </span>
        </div>

        {tagline && (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
              margin: 0,
              textAlign: "center",
              opacity: taglineOpacity,
            }}
          >
            {tagline}
          </p>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Feature (4.5s = 135f each) ────────────────────────────────
const CinematicFeatureScene: React.FC<{
  featureIndex: number;
  totalFeatures: number;
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}> = ({ featureIndex, totalFeatures, icon, title, description, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const iconScale = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 100 } }),
    [0, 1],
    [0.5, 1]
  );

  const lineWidth = interpolate(frame, [20, 50], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Noise opacity={0.015} />

      <div
        style={{
          position: "absolute",
          width: "25%",
          height: "25%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${accentColor}08 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Feature counter — top right */}
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 72,
          display: "flex",
          gap: 8,
          opacity: interpolate(frame, [0, 15], [0, 0.4], { extrapolateRight: "clamp" }),
        }}
      >
        {Array.from({ length: totalFeatures }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === featureIndex ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i === featureIndex ? accentColor : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 200px",
          gap: 24,
        }}
      >
        <div style={{ opacity: iconOpacity, transform: `scale(${iconScale})` }}>
          <FeatureIcon icon={icon} accentColor={accentColor} size={80} />
        </div>

        <h3
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            letterSpacing: -2.5,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={20} delay={15} yOffset={25} blurAmount={4}>
            {title}
          </AnimatedText>
        </h3>

        <div
          style={{
            width: lineWidth,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
            borderRadius: 1,
          }}
        />

        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            margin: 0,
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          <AnimatedText split="word" staggerFrames={3} durationPerUnit={18} delay={35} yOffset={12} blurAmount={3}>
            {description}
          </AnimatedText>
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (5s = 150f) ───────────────────────────────────────────
const CinematicCtaScene: React.FC<{
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const buttonDelay = 50;
  const buttonOpacity = interpolate(frame, [buttonDelay, buttonDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const buttonScale = interpolate(
    spring({ frame: frame - buttonDelay, fps, config: { damping: 14, stiffness: 100 } }),
    [0, 1],
    [0.85, 1]
  );

  const urlDelay = 75;
  const urlOpacity = interpolate(frame, [urlDelay, urlDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const breathe = interpolate(Math.sin(frame * 0.06), [-1, 1], [1, 1.015]);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Noise opacity={0.015} />

      <div
        style={{
          position: "absolute",
          width: "50%",
          height: "40%",
          left: "25%",
          top: "30%",
          background: `radial-gradient(ellipse, ${accentColor}12 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          opacity: contentOpacity,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 78,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          <AnimatedText split="word" staggerFrames={5} durationPerUnit={22} delay={8} yOffset={30} blurAmount={5}>
            {cta}
          </AnimatedText>
        </h2>

        <div
          style={{
            transform: `scale(${buttonScale * breathe})`,
            opacity: buttonOpacity,
          }}
        >
          <div
            style={{
              background: "transparent",
              border: `1.5px solid ${accentColor}`,
              borderRadius: 16,
              padding: "18px 48px",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 600,
                color: accentColor,
                letterSpacing: 1,
              }}
            >
              {websiteUrl}
            </span>
            <span style={{ fontSize: 18, color: accentColor }}>→</span>
          </div>
        </div>

        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(255,255,255,0.2)",
            margin: 0,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: urlOpacity,
          }}
        >
          Get started today
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────
export const CinematicMinimalVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    heroWord = "Ship",
    differentiator = "The only platform that turns ideas into production in minutes",
    tagline = "",
    hook = "",
    problem = "",
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    solution,
  } = props;
  const featureList = features.slice(0, 3);

  return (
    <AbsoluteFill style={{ background: BG }}>
      <TransitionSeries>
        {/* Hero Word — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <HeroWordScene heroWord={heroWord} hook={hook} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Differentiator — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <DifferentiatorScene
            differentiator={differentiator}
            companyName={companyName}
            tagline={tagline}
            problem={problem}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        {/* Features — 4.5s each, alternating layouts */}
        {featureList.map((feature, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
            <TransitionSeries.Sequence durationInFrames={135}>
              <CinematicFeatureScene
                featureIndex={i}
                totalFeatures={featureList.length}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* CTA — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <CinematicCtaScene
            cta={cta}
            websiteUrl={websiteUrl}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark logoUrl={logoUrl} companyName={companyName} accentColor={accentColor} />
    </AbsoluteFill>
  );
};
