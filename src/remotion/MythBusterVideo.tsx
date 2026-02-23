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

import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { GlitchEffect } from "./components/GlitchEffect";
import { HighlighterText } from "./components/HighlighterText";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 14;

// Hook(90) + 3×MythReality(180) + Reveal(135) + CTA(120) - 5×14 = 855
export const TEMPLATE_8_FRAMES = 855;

const HookScene: React.FC<{ hook: string; problem: string; accentColor: string }> = ({
  hook,
  problem,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const popScale = interpolate(
    spring({ frame, fps, config: { damping: 10, stiffness: 160 } }),
    [0, 1],
    [0.82, 1]
  );

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GlitchEffect intensity={1.2} seed={frame}>
        <GradientBackground accentColor={accentColor} variant="hook" />
        <Noise opacity={0.04} />
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 120px",
            transform: `scale(${popScale})`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 80,
              lineHeight: 1.08,
              letterSpacing: -3,
              color: "white",
              textAlign: "center",
              maxWidth: 1100,
            }}
          >
            <AnimatedText split="word" animation="slam" staggerFrames={4} delay={3} yOffset={28}>
              {hook}
            </AnimatedText>
          </h2>
          {problem ? (
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                margin: "20px 0 0",
                maxWidth: 700,
                opacity: interpolate(frame, [40, 58], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              {problem}
            </p>
          ) : null}
        </AbsoluteFill>
      </GlitchEffect>
    </AbsoluteFill>
  );
};

const MythRealityScene: React.FC<{
  mythIndex: number;
  totalMyths: number;
  myth: string;
  reality: string;
  accentColor: string;
}> = ({ mythIndex, totalMyths, myth, reality, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const mythPhaseEnd = 75;
  const isRealityPhase = frame > mythPhaseEnd;

  // Myth phase animations
  const mythOpacity = interpolate(frame, [0, 15, mythPhaseEnd - 10, mythPhaseEnd], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mythScale = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1],
    [0.9, 1]
  );

  const strikeWidth = interpolate(frame, [45, 65], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Reality phase animations
  const realityOpacity = interpolate(frame, [mythPhaseEnd, mythPhaseEnd + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const realityScale = interpolate(
    spring({ frame: frame - mythPhaseEnd, fps, config: { damping: 12, stiffness: 130 } }),
    [0, 1],
    [0.85, 1]
  );

  const flash = interpolate(frame, [mythPhaseEnd, mythPhaseEnd + 4, mythPhaseEnd + 10], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={isRealityPhase ? accentColor : "#555555"} variant={isRealityPhase ? "solution" : "hook"} />
      <Noise opacity={isRealityPhase ? 0.02 : 0.04} />
      {isRealityPhase && <FloatingParticles count={15} color={`${accentColor}35`} seed={mythIndex * 10 + 5} />}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255,255,255,${flash})`,
          pointerEvents: "none",
        }}
      />

      {/* Step indicator */}
      <div style={{ position: "absolute", top: 52, right: 72, display: "flex", gap: 8 }}>
        {Array.from({ length: totalMyths }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === mythIndex ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i <= mythIndex ? accentColor : "rgba(255,255,255,0.2)",
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
          padding: "0 140px",
          gap: 40,
        }}
      >
        {/* Myth phase */}
        {!isRealityPhase && (
          <div
            style={{
              opacity: mythOpacity,
              transform: `scale(${mythScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                background: "rgba(255,80,80,0.15)",
                border: "1px solid rgba(255,80,80,0.3)",
                borderRadius: 100,
                padding: "8px 24px",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#FF5555",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                Myth #{mythIndex + 1}
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <h2
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 56,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  letterSpacing: -2,
                  lineHeight: 1.15,
                  margin: 0,
                  maxWidth: 850,
                }}
              >
                <AnimatedText split="word" staggerFrames={3} durationPerUnit={18} delay={8} yOffset={25}>
                  {`\u201C${myth}\u201D`}
                </AnimatedText>
              </h2>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "5%",
                  width: `${strikeWidth * 0.9}%`,
                  height: 4,
                  background: "#FF5555",
                  borderRadius: 2,
                  transform: "translateY(-50%) rotate(-2deg)",
                  boxShadow: "0 0 12px rgba(255,85,85,0.5)",
                }}
              />
            </div>
          </div>
        )}

        {/* Reality phase */}
        {isRealityPhase && (
          <div
            style={{
              opacity: realityOpacity,
              transform: `scale(${realityScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                background: `${accentColor}20`,
                border: `1px solid ${accentColor}40`,
                borderRadius: 100,
                padding: "8px 24px",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 13,
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                Reality
              </span>
            </div>
            <h2
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 60,
                fontWeight: 800,
                color: "white",
                textAlign: "center",
                letterSpacing: -2.5,
                lineHeight: 1.12,
                margin: 0,
                maxWidth: 850,
              }}
            >
              <HighlighterText color="#28CA41" delay={15} durationFrames={35}>
                {reality}
              </HighlighterText>
            </h2>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const RevealScene: React.FC<{
  companyName: string;
  tagline: string;
  solution: string;
  accentColor: string;
}> = ({ companyName, tagline, solution, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const revealSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const revealScale = interpolate(revealSpring, [0, 1], [0.7, 1]);
  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.15, 0.4]);

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.03})` }}>
      <GradientBackground accentColor={accentColor} variant="intro" />
      <FloatingParticles count={25} color={`${accentColor}45`} seed={33} />
      <Noise opacity={0.02} />

      <div
        style={{
          position: "absolute",
          width: "55%",
          height: "40%",
          left: "22%",
          top: "30%",
          background: `radial-gradient(ellipse, ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
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
          gap: 28,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${revealScale})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          The truth is
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
          }}
        >
          {companyName}
        </h1>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={22} delay={35} yOffset={16} blurAmount={4}>
            {tagline}
          </AnimatedText>
        </p>
        {solution ? (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              textAlign: "center",
              maxWidth: 650,
              opacity: interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [55, 75], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            }}
          >
            {solution}
          </p>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{
  companyName: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ companyName, cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const snapScale = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1],
    [0.88, 1]
  );
  const buttonOpacity = interpolate(frame, [28, 40], [0, 1], { extrapolateRight: "clamp" });
  const buttonScale = interpolate(
    spring({ frame: frame - 28, fps, config: { damping: 12, stiffness: 100 } }),
    [0, 1],
    [0.7, 1]
  );
  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.6]);

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
      <FloatingParticles count={28} color={`${accentColor}40`} maxSize={4} seed={99} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          transform: `scale(${snapScale})`,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 82,
            fontWeight: 800,
            color: "white",
            letterSpacing: -3,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.08,
          }}
        >
          <AnimatedText split="word" animation="slam" staggerFrames={4} delay={5} yOffset={35}>
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
              boxShadow: `0 16px 50px ${accentColor}55`,
            }}
          >
            <span style={{ fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: "white" }}>
              {cta}
            </span>
            <span style={{ fontSize: 22, color: "white" }}>→</span>
          </div>
        </div>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            fontWeight: 500,
            color: `${accentColor}bb`,
            margin: 0,
            letterSpacing: 1,
            opacity: interpolate(frame, [45, 58], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {websiteUrl}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MythBusterVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    hook,
    problem = "",
    solution = "",
    myths = [
      { myth: "You need a big team to ship fast", reality: "Solo founders ship in minutes with AI" },
      { myth: "Automation is only for enterprise", reality: "Start free, scale when ready" },
      { myth: "It takes weeks to set up", reality: "Go live in under 5 minutes" },
    ],
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
  } = props;
  const mythList = myths.slice(0, 3);

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene hook={hook} problem={problem} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        {mythList.map((m, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Transition
              presentation={i === 0 ? fade() : slide({ direction: "from-right" })}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
            <TransitionSeries.Sequence durationInFrames={180}>
              <MythRealityScene
                mythIndex={i}
                totalMyths={mythList.length}
                myth={m.myth}
                reality={m.reality}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={135}>
          <RevealScene companyName={companyName} tagline={tagline} solution={solution} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <CtaScene companyName={companyName} cta={cta} websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark logoUrl={logoUrl} companyName={companyName} accentColor={accentColor} />
    </AbsoluteFill>
  );
};
