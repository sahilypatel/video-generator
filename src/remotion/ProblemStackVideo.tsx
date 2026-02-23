import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { VideoProps } from "./types";
import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { GlitchEffect } from "./components/GlitchEffect";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { FONT_FAMILY } from "./fonts";
import { LogoWatermark } from "./components/LogoWatermark";
import { FeatureIcon } from "./components/FeatureIcon";


const TRANSITION = 15;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ─── Scene 1: Hook (2.5s = 75f) — "Sound familiar?" ─────────────────────
const S4Hook: React.FC<{ hook: string; accentColor: string }> = ({
  hook,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const shakeX = frame < 20
    ? interpolate(Math.sin(frame * 1.5), [-1, 1], [-4, 4])
    : 0;

  const popSpring = spring({ frame, fps, config: { damping: 10, stiffness: 180 } });
  const scale = interpolate(popSpring, [0, 1], [0.85, 1]);

  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GlitchEffect intensity={1.5} seed={frame}>
        <GradientBackground accentColor={accentColor} variant="hook" />
        <Noise opacity={0.04} />

        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateX(${shakeX}px) scale(${scale})`,
          }}
        >
          <h2
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 88,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: -3,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            <AnimatedText
              split="none"
              animation="slam"
              delay={3}
              yOffset={30}
              blurAmount={5}
              springConfig={{ damping: 14, stiffness: 120 }}
            >
              {hook}
            </AnimatedText>
          </h2>
        </AbsoluteFill>
      </GlitchEffect>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem Stack (6s = 180f) — Cards pile up ──────────────────
const S4ProblemStack: React.FC<{
  painPoints: string[];
  problem: string;
  accentColor: string;
}> = ({ painPoints, problem, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const cards = painPoints.slice(0, 4);
  const cardDelay = 30;

  const redFlash = interpolate(
    frame,
    [0, 10, 20],
    [0, 0.08, 0],
    { extrapolateRight: "clamp" }
  );

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <Noise opacity={0.035} />

      {/* Red stress overlay */}
      <AbsoluteFill
        style={{
          background: `rgba(255,50,50,${redFlash})`,
          pointerEvents: "none",
        }}
      />

      {problem ? (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 700,
            }}
          >
            {problem}
          </span>
        </div>
      ) : null}

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 200px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 700,
            height: 450,
          }}
        >
          {cards.map((pain, i) => {
            const cardFrame = frame - i * cardDelay;
            if (cardFrame < 0) return null;

            const landSpring = spring({
              frame: cardFrame,
              fps,
              config: { damping: 8, stiffness: 150 },
            });
            const cardScale = interpolate(landSpring, [0, 1], [0.3, 1]);
            const cardOpacity = interpolate(cardFrame, [0, 8], [0, 1], {
              extrapolateRight: "clamp",
            });
            const cardY = interpolate(landSpring, [0, 1], [-200, 0]);

            const rotation = (seededRandom(i * 7 + 42) - 0.5) * 12;
            const offsetX = (seededRandom(i * 13 + 7) - 0.5) * 80;
            const offsetY = i * -18;

            // Subtle shake on landing
            const shakeAmount = cardFrame < 12
              ? interpolate(Math.sin(cardFrame * 2), [-1, 1], [-2, 2])
              : 0;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translateX(${offsetX + shakeAmount}px) translateY(${offsetY + cardY}px) rotate(${rotation}deg) scale(${cardScale})`,
                  opacity: cardOpacity,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,80,80,0.25)",
                  borderRadius: 18,
                  padding: "24px 36px",
                  minWidth: 400,
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  zIndex: i,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 28, opacity: 0.8 }}>
                    {["😤", "💀", "😩", "🔥"][i % 4]}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 22,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.3,
                    }}
                  >
                    {pain}
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

// ─── Scene 3: Product Reveal (4.5s = 135f) — Clean after sweep ──────────
const S4Reveal: React.FC<{
  companyName: string;
  tagline: string;
  solution: string;
  accentColor: string;
}> = ({ companyName, tagline, solution, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const revealSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const revealScale = interpolate(revealSpring, [0, 1], [0.7, 1]);

  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.2, 0.45]);

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.03})` }}>
      <GradientBackground accentColor={accentColor} variant="intro" />
      <FloatingParticles count={25} color={`${accentColor}40`} seed={33} />
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
            opacity: interpolate(frame, [0, 15], [0, 0.8], { extrapolateRight: "clamp" }),
          }}
        >
          Meet your solution
        </span>

        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 110,
            fontWeight: 800,
            margin: 0,
            textAlign: "center",
            letterSpacing: -4,
            lineHeight: 1,
            background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 60%, #FF5E68 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <AnimatedText
            split="character"
            animation="scale-in"
            staggerFrames={2}
            delay={10}
            yOffset={0}
            blurAmount={0}
          >
            {companyName}
          </AnimatedText>
        </h1>

        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            textAlign: "center",
            maxWidth: 650,
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
              lineHeight: 1.4,
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

// ─── Scene 4: Feature Grid (4s = 120f) — All features at once ───────────
const S4FeatureGrid: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  accentColor: string;
}> = ({ features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const count = Math.min(features.length, 3);
  const stagger = 10;

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 36,
        }}
      >
        {features.slice(0, count).map((feature, i) => {
          const cardSpring = spring({
            frame: frame - i * stagger,
            fps,
            config: { damping: 12, stiffness: 120 },
          });
          const cardY = interpolate(cardSpring, [0, 1], [60, 0]);
          const cardOpacity = interpolate(frame, [i * stagger, i * stagger + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                transform: `translateY(${cardY}px)`,
                opacity: cardOpacity,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${accentColor}25`,
                borderRadius: 24,
                padding: "36px 32px",
                flex: "0 0 auto",
                width: 340,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                textAlign: "center",
              }}
            >
              <FeatureIcon icon={feature.icon} accentColor={accentColor} size={72} />
              <h4
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 24,
                  fontWeight: 700,
                  color: "white",
                  margin: 0,
                  letterSpacing: -0.5,
                }}
              >
                {feature.title}
              </h4>
              <p
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 15,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: CTA with Confetti (3.5s = 105f) ──────────────────────────
const S4CTA: React.FC<{
  companyName: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ companyName, cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const snapSpring = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const snapScale = interpolate(snapSpring, [0, 1], [0.85, 1]);

  const buttonOpacity = interpolate(frame, [25, 38], [0, 1], { extrapolateRight: "clamp" });
  const buttonSpring = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 100 } });
  const buttonScale = interpolate(buttonSpring, [0, 1], [0.7, 1]);

  const urlOpacity = interpolate(frame, [40, 52], [0, 1], { extrapolateRight: "clamp" });

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

      <FloatingParticles count={25} color={`${accentColor}40`} maxSize={4} seed={111} />
      <Noise opacity={0.025} />

      <ConfettiBurst
        count={60}
        triggerFrame={5}
        accentColor={accentColor}
        originX={50}
        originY={45}
        seed={777}
      />

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
          <AnimatedText split="word" animation="slam" staggerFrames={4} delay={5} yOffset={35} blurAmount={6}>
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

        <div style={{ opacity: urlOpacity }}>
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
export const ProblemStackVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    hook,
    problem = "",
    solution,
    painPoints = [
      "Manual workflows eating your day",
      "Spreadsheets breaking at the worst time",
      "Hours lost to repetitive tasks",
      "No visibility into what's working",
    ],
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
  } = props;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Hook — 2.5s */}
        <TransitionSeries.Sequence durationInFrames={75}>
          <S4Hook hook={hook} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Problem Stack — 6s */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <S4ProblemStack painPoints={painPoints} problem={problem} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1920, height: 1080 })}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Scene 3: Product Reveal — 4.5s */}
        <TransitionSeries.Sequence durationInFrames={135}>
          <S4Reveal companyName={companyName} tagline={tagline} solution={solution ?? ""} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 4: Feature Grid — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <S4FeatureGrid features={features} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 5: CTA — 3.5s */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <S4CTA companyName={companyName} cta={cta} websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark logoUrl={logoUrl} companyName={companyName} accentColor={accentColor} />


    </AbsoluteFill>
  );
};
