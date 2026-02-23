import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { VideoProps } from "./types";

import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { FeatureIcon } from "./components/FeatureIcon";
import { HighlighterText } from "./components/HighlighterText";
import { FONT_FAMILY } from "./fonts";
import { LogoWatermark } from "./components/LogoWatermark";
import { SFX } from "./components/SFX";
import { BackgroundMusic } from "./components/BackgroundMusic";

const TRANSITION = 15;

// ─── Act 1: Hook (3s = 90f) ─────────────────────────────────────────────────
const Act1Hook: React.FC<{ hook: string; accentColor: string }> = ({
  hook,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const scaleVal = interpolate(popSpring, [0, 1], [0.9, 1]);

  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.2, 0.5]);

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.03})` }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={22} color="rgba(255,255,255,0.2)" seed={5} />
      <Noise opacity={0.025} />

      <div
        style={{
          position: "absolute",
          width: "50%",
          height: "50%",
          left: "25%",
          top: "25%",
          background: `radial-gradient(ellipse, ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 65%)`,
          filter: "blur(70px)",
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
        }}
      >
        <div style={{ transform: `scale(${scaleVal})` }}>
          <h2
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 78,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: -3,
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            <AnimatedText
              split="word"
              staggerFrames={4}
              durationPerUnit={18}
              delay={3}
              yOffset={30}
              blurAmount={5}
            >
              {hook}
            </AnimatedText>
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Act 2: Pain Point (5.5s = 165f) ───────────────────────────────────────
const Act2Pain: React.FC<{ problem: string; accentColor: string }> = ({
  problem,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const shakeX = frame < 40
    ? interpolate(Math.sin(frame * 0.8), [-1, 1], [-3, 3])
    : 0;

  const redFlash = interpolate(frame, [0, 15, 30], [0, 0.12, 0], {
    extrapolateRight: "clamp",
  });

  const exit = interpolate(frame, [durationInFrames - 18, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.03})` }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <Noise opacity={0.03} />

      {/* Red stress flash */}
      <AbsoluteFill
        style={{
          background: `rgba(255,60,60,${redFlash})`,
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 36,
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Frustration emoji */}
        <div
          style={{
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(
              spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 120 } }),
              [0, 1],
              [0.4, 1]
            )})`,
            fontSize: 72,
          }}
        >
          😩
        </div>

        {/* Problem text */}
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            letterSpacing: -2,
            lineHeight: 1.2,
            margin: 0,
            maxWidth: 900,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={20} delay={15} yOffset={28} blurAmount={5}>
            {problem}
          </AnimatedText>
        </h2>

        {/* Accent underline */}
        <div
          style={{
            width: interpolate(frame, [60, 100], [0, 200], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
            height: 2,
            background: `linear-gradient(90deg, transparent, #FF5E68, transparent)`,
            borderRadius: 1,
            opacity: interpolate(frame, [58, 70], [0, 0.7], { extrapolateRight: "clamp" }),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Act 3: Product Reveal (7.5s = 225f) ────────────────────────────────────
const Act3Reveal: React.FC<{
  companyName: string;
  tagline: string;
  accentColor: string;
}> = ({ companyName, tagline, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const revealSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const revealScale = interpolate(revealSpring, [0, 1], [0.7, 1]);
  const revealOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  const glowIntensity = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.15, 0.4]);

  const lineWidth = interpolate(frame, [30, 70], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const exit = interpolate(frame, [durationInFrames - 20, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.03})` }}>
      <GradientBackground accentColor={accentColor} variant="intro" />
      <FloatingParticles count={30} color={`${accentColor}50`} seed={33} />
      <Noise opacity={0.02} />

      <div
        style={{
          position: "absolute",
          width: "60%",
          height: "45%",
          left: "20%",
          top: "28%",
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
          gap: 32,
          opacity: revealOpacity,
          transform: `scale(${revealScale})`,
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
            opacity: interpolate(frame, [0, 20], [0, 0.8], { extrapolateRight: "clamp" }),
          }}
        >
          Introducing
        </span>

        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 100,
            fontWeight: 800,
            margin: 0,
            textAlign: "center",
            letterSpacing: -4,
            lineHeight: 1,
            background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 55%, #FF5E68 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(
              spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } }),
              [0, 1],
              [45, 0]
            )}px)`,
          }}
        >
          {companyName}
        </h1>

        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            borderRadius: 1,
            opacity: interpolate(frame, [28, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />

        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={22} delay={40} yOffset={18} blurAmount={4}>
            {tagline}
          </AnimatedText>
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Act 4: Feature Showcase (21s = 630f, cycles through features) ──────────
const Act4Features: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  accentColor: string;
}> = ({ features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const count = Math.min(features.length, 4);
  const featureDuration = Math.floor(durationInFrames / count);

  const currentFeatureIndex = Math.min(Math.floor(frame / featureDuration), count - 1);
  const featureLocalFrame = frame - currentFeatureIndex * featureDuration;

  const feature = features[currentFeatureIndex];

  const iconSpring = spring({
    frame: featureLocalFrame,
    fps,
    config: { damping: 12, stiffness: 130 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0.3, 1]);
  const iconOpacity = interpolate(featureLocalFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const cardOpacity = interpolate(featureLocalFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const cardY = interpolate(
    spring({ frame: featureLocalFrame, fps, config: { damping: 200 } }),
    [0, 1],
    [30, 0]
  );

  const featureExit = interpolate(
    featureLocalFrame,
    [featureDuration - 20, featureDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const globalExit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const combinedOpacity = (1 - featureExit) * (1 - globalExit);

  return (
    <AbsoluteFill style={{ opacity: combinedOpacity }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      {/* Feature counter dots */}
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 72,
          display: "flex",
          gap: 8,
          opacity: 0.5,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentFeatureIndex ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === currentFeatureIndex ? accentColor : "rgba(255,255,255,0.2)",
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
          padding: "0 120px",
          gap: 32,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
        }}
      >
        {/* Icon */}
        <div
          style={{
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
          }}
        >
          <FeatureIcon icon={feature.icon} accentColor={accentColor} size={100} />
        </div>

        {/* Headline */}
        <h3
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={4}
            durationPerUnit={18}
            delay={8}
            yOffset={30}
            blurAmount={5}
          >
            {feature.title}
          </AnimatedText>
        </h3>

        {/* One-liner benefit */}
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            margin: 0,
            maxWidth: 650,
            lineHeight: 1.5,
          }}
        >
          <AnimatedText split="word" staggerFrames={2} durationPerUnit={18} delay={16} yOffset={14} blurAmount={3}>
            {feature.description}
          </AnimatedText>
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Act 5: Social Proof (7.5s = 225f) ─────────────────────────────────────
const Act5Proof: React.FC<{
  socialProofStat: string;
  proofLogos: string[];
  accentColor: string;
}> = ({ socialProofStat, proofLogos, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Only do the count-up split if the stat literally starts with digits (e.g. "500+ teams")
  const leadingNumMatch = socialProofStat.match(/^([\d,]+)(.*)$/);
  const hasLeadingNum = !!leadingNumMatch;
  const targetNum = hasLeadingNum ? (parseInt(leadingNumMatch![1].replace(/,/g, "")) || 500) : 0;
  const statSuffix = hasLeadingNum ? leadingNumMatch![2].trim() : "";
  const countProgress = interpolate(frame, [5, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const displayNum = Math.round(targetNum * countProgress);

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.03})` }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={10} color={`${accentColor}30`} seed={55} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 40,
        }}
      >
        {/* Count-up stat */}
        <div
          style={{
            transform: `scale(${interpolate(
              spring({ frame, fps, config: { damping: 14, stiffness: 100 } }),
              [0, 1],
              [0.85, 1]
            )})`,
          }}
        >
          <h2
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 96,
              fontWeight: 800,
              margin: 0,
              textAlign: "center",
              letterSpacing: -4,
              lineHeight: 1.1,
              background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 60%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {hasLeadingNum
              ? `${displayNum.toLocaleString()}${statSuffix ? ` ${statSuffix}` : ""}`
              : socialProofStat}
          </h2>
        </div>

        {/* Logo wall — staggered */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          {proofLogos.slice(0, 4).map((logo, i) => {
            const d = 40 + i * 8;
            const logoSpring = spring({ frame: frame - d, fps, config: { damping: 18, stiffness: 120 } });
            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(frame, [d, d + 18], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(logoSpring, [0, 1], [30, 0])}px)`,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "10px 26px",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {logo}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Act 6: CTA — Freeze Frame (8.5s = 255f) ───────────────────────────────
const Act6CTA: React.FC<{
  companyName: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ companyName, cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const snapSpring = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const snapScale = interpolate(snapSpring, [0, 1], [0.85, 1]);

  const buttonSpring = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 100 } });
  const buttonScale = interpolate(buttonSpring, [0, 1], [0.7, 1]);
  const buttonOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  const urlOpacity = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const urlY = interpolate(
    spring({ frame: frame - 55, fps, config: { damping: 200 } }),
    [0, 1],
    [14, 0]
  );

  const glowPulse = interpolate(Math.sin(frame * 0.09), [-1, 1], [0.25, 0.55]);

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 48%, ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <FloatingParticles count={30} color={`${accentColor}40`} maxSize={4} seed={111} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          transform: `scale(${snapScale})`,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 84,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={20} delay={5} yOffset={35} blurAmount={6}>
            {cta}
          </AnimatedText>
        </h2>

        <div style={{ transform: `scale(${buttonScale})`, opacity: buttonOpacity }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #FF5E68)`,
              borderRadius: 20,
              padding: "20px 56px",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              boxShadow: `0 16px 50px ${accentColor}55, 0 0 80px ${accentColor}18`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 26,
                fontWeight: 700,
                color: "white",
                letterSpacing: -0.5,
              }}
            >
              {cta}
            </span>
            <span style={{ fontSize: 22, color: "white" }}>→</span>
          </div>
        </div>

        <div style={{ transform: `translateY(${urlY}px)`, opacity: urlOpacity }}>
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

// ─── Main Composition ──────────────────────────────────────────────────────
export const SixActVideo: React.FC<VideoProps> = (props) => {
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
    socialProofStat = "Used by 500+ startups",
    proofLogos = ["Vercel", "Stripe", "Notion"],
    logoUrl,
    musicTrack = "ambient",
    musicVolume = 0.15,
    sfxEnabled = true,
  } = props;

  // Scene start frames (accounting for 15-frame transitions between acts)
  const act1Start = 0;
  const act2Start = 90 - TRANSITION;
  const act3Start = act2Start + 135 - TRANSITION;
  const act4Start = act3Start + 150 - TRANSITION;
  const act5Start = act4Start + 360 - TRANSITION;
  const act6Start = act5Start + 120 - TRANSITION;

  const featureCount = Math.min(features.length, 4);
  const featureDuration = Math.floor(360 / featureCount);

  return (
    <AbsoluteFill>
      {musicTrack !== "none" && (
        <BackgroundMusic track={musicTrack} volume={musicVolume} />
      )}

      {sfxEnabled && (
        <>
          {/* Whoosh at each scene transition */}
          <SFX type="whoosh" frame={act2Start} volume={0.25} />
          <SFX type="whoosh" frame={act3Start} volume={0.25} />
          <SFX type="whoosh" frame={act4Start} volume={0.2} />
          <SFX type="whoosh" frame={act5Start} volume={0.25} />
          <SFX type="whoosh" frame={act6Start} volume={0.25} />

          {/* Impact when product name slams in (Act 3, ~10 frames in) */}
          <SFX type="impact" frame={act3Start + 10} volume={0.35} />

          {/* Pop when each feature appears */}
          {Array.from({ length: featureCount }).map((_, i) => (
            <SFX
              key={`feature-pop-${i}`}
              type="pop"
              frame={act4Start + i * featureDuration + 8}
              volume={0.3}
            />
          ))}

          {/* Ding at CTA */}
          <SFX type="ding" frame={act6Start + 5} volume={0.3} />
        </>
      )}

      <TransitionSeries>
        {/* Act 1: Hook — 3s */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <Act1Hook hook={hook} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Act 2: Pain Point — 4.5s */}
        <TransitionSeries.Sequence durationInFrames={135}>
          <Act2Pain problem={problem} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Act 3: Product Reveal — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Act3Reveal companyName={companyName} tagline={tagline} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Act 4: Feature Showcase — 12s */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <Act4Features features={features} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Act 5: Social Proof — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <Act5Proof
            socialProofStat={socialProofStat}
            proofLogos={proofLogos}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Act 6: CTA — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Act6CTA companyName={companyName} cta={cta} websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark logoUrl={logoUrl} companyName={companyName} accentColor={accentColor} />


    </AbsoluteFill>
  );
};
