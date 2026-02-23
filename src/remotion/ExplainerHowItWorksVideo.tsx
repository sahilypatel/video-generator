import React from "react";
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
import { slide } from "@remotion/transitions/slide";
import { VideoProps } from "./types";
import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

export const TEMPLATE_26_FRAMES = 900;

const DARK_BG = "#0a0a14";

// ─── Scene 1: Hook Question (90f) ───────────────────────────────────────────
const HookScene: React.FC<{
  hook: string;
  companyName: string;
  accentColor: string;
  logoText?: string;
}> = ({ hook, companyName, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeUp = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const textY = interpolate(fadeUp, [0, 1], [60, 0]);
  const textOpacity = interpolate(fadeUp, [0, 1], [0, 1]);

  const badge = logoText || companyName.slice(0, 2).toUpperCase();
  const badgeSpring = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 140 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.5, 1]);
  const badgeOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={20} color="rgba(255,255,255,0.15)" seed={26} />
      <Noise opacity={0.025} />

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
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
            borderRadius: 14,
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 16,
              fontWeight: 800,
              color: "#000",
            }}
          >
            {badge}
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(0,0,0,0.7)",
            }}
          >
            {companyName}
          </span>
        </div>

        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 80,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: -3,
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            <AnimatedText split="word" staggerFrames={4} durationPerUnit={18} delay={5} yOffset={35} blurAmount={5}>
              {hook || "How does it work?"}
            </AnimatedText>
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Step Scene (120f each) ─────────────────────────────────────────────────
const StepScene: React.FC<{
  stepNumber: number;
  title: string;
  description: string;
  accentColor: string;
  isLast: boolean;
}> = ({ stepNumber, title, description, accentColor, isLast }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const circleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  const circleScale = interpolate(circleSpring, [0, 1], [0.3, 1]);

  const titleSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 100 } });
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const descOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const connectorHeight = interpolate(frame, [50, 95], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const checkSpring = isLast
    ? spring({ frame: frame - 60, fps, config: { damping: 8, stiffness: 160 } })
    : 0;
  const checkScale = interpolate(checkSpring, [0, 1], [0, 1.2]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "0 160px",
        }}
      >
        <div
          style={{
            transform: `scale(${circleScale})`,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 60px ${accentColor}40`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 48,
              fontWeight: 800,
              color: "#000",
            }}
          >
            {stepNumber}
          </span>
        </div>

        <div
          style={{
            marginTop: 28,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <h2
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: -2,
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            margin: 0,
            marginTop: 16,
            maxWidth: 600,
            lineHeight: 1.5,
            opacity: descOpacity,
          }}
        >
          {description}
        </p>

        {!isLast && (
          <div
            style={{
              marginTop: 24,
              width: 3,
              height: connectorHeight,
              background: `linear-gradient(180deg, ${accentColor}, transparent)`,
              borderRadius: 2,
            }}
          />
        )}

        {isLast && (
          <div
            style={{
              marginTop: 24,
              transform: `scale(${checkScale})`,
              opacity: checkSpring > 0.01 ? 1 : 0,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill={accentColor} />
              <polyline
                points="14,24 22,32 34,18"
                fill="none"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Flow Diagram (150f) ──────────────────────────────────────────
const FlowDiagramScene: React.FC<{
  steps: Array<{ title: string; description: string }>;
  accentColor: string;
}> = ({ steps, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visibleSteps = steps.slice(0, 4);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={12} color={`${accentColor}20`} seed={66} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 80px",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 38,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            margin: 0,
            opacity: interpolate(frame, [5, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          The Complete Flow
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {visibleSteps.map((step, i) => {
            const stepDelay = 15 + i * 18;
            const stepSpring = spring({
              frame: frame - stepDelay,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const stepScale = interpolate(stepSpring, [0, 1], [0.6, 1]);
            const stepOpacity = interpolate(stepSpring, [0, 1], [0, 1]);

            const arrowDelay = stepDelay + 12;
            const arrowOpacity = interpolate(frame, [arrowDelay, arrowDelay + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    width: 240,
                    opacity: stepOpacity,
                    transform: `scale(${stepScale})`,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}AA)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 30px ${accentColor}30`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_FAMILY,
                        fontSize: 24,
                        fontWeight: 800,
                        color: "#000",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "white",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.45)",
                      textAlign: "center",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {i < visibleSteps.length - 1 && (
                  <div
                    style={{
                      opacity: arrowOpacity,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 4px",
                      marginBottom: 50,
                    }}
                  >
                    <svg width="44" height="16" viewBox="0 0 44 16">
                      <line x1="0" y1="8" x2="32" y2="8" stroke={accentColor} strokeWidth="2" strokeDasharray="4 3" />
                      <polygon points="30,3 40,8 30,13" fill={accentColor} />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 7: CTA (180f) ───────────────────────────────────────────────────
const CTAScene: React.FC<{
  solution: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ solution, cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1]);

  const buttonSpring = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 100 } });
  const buttonScale = interpolate(buttonSpring, [0, 1], [0.6, 1]);
  const buttonOpacity = interpolate(frame, [30, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [50, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.03]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <FloatingParticles count={24} color={`${accentColor}30`} seed={99} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          transform: `scale(${entryScale})`,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            letterSpacing: -2,
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.15,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={18} delay={5} yOffset={30} blurAmount={5}>
            {solution}
          </AnimatedText>
        </h2>

        <div style={{ opacity: buttonOpacity, transform: `scale(${buttonScale * pulse})` }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              borderRadius: 18,
              padding: "18px 50px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 16px 50px ${accentColor}44`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                fontWeight: 700,
                color: "#000",
              }}
            >
              {cta}
            </span>
            <span style={{ fontSize: 20, color: "#000" }}>→</span>
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
export const ExplainerHowItWorksVideo: React.FC<VideoProps> = (props) => {
  const {
    hook,
    companyName,
    solution,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
    demoSteps = [],
    features = [],
  } = props;

  const steps = demoSteps.length > 0
    ? demoSteps
    : features.slice(0, 4).map((f) => ({ title: f.title, description: f.description }));

  const safeSteps = steps.length > 0
    ? steps
    : [
        { title: "Step 1", description: "Get started quickly" },
        { title: "Step 2", description: "Configure your setup" },
        { title: "Step 3", description: "Launch and grow" },
      ];

  const visibleSteps = safeSteps.slice(0, 4);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene hook={hook} companyName={companyName} accentColor={accentColor} logoText={logoText} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Scenes 2–5: Individual Steps */}
        {visibleSteps.map((step, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={120}>
              <StepScene
                stepNumber={i + 1}
                title={step.title}
                description={step.description}
                accentColor={accentColor}
                isLast={i === visibleSteps.length - 1}
              />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={i % 2 === 0 ? slide({ direction: "from-right" }) : fade()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
          </React.Fragment>
        ))}

        {/* Scene 6: Flow Diagram */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <FlowDiagramScene steps={visibleSteps} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 7: CTA */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <CTAScene solution={solution} cta={cta} websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark logoUrl={logoUrl} companyName={companyName} accentColor={accentColor} />
    </AbsoluteFill>
  );
};
