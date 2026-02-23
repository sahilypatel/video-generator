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
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { VideoProps } from "./types";

import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { FeatureIcon } from "./components/FeatureIcon";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

// Hook(90) + Before(150) + Wipe(180) + After(150) + Bridge(120) + CTA(120) - 5*15 = 735
export const TEMPLATE_7_FRAMES = 735;

const HookScene: React.FC<{ hook: string; accentColor: string }> = ({
  hook,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const popSpring = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const scale = interpolate(popSpring, [0, 1], [0.85, 1]);
  const flash = interpolate(frame, [30, 34, 40], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={20} color="rgba(255,255,255,0.15)" seed={7} />
      <Noise opacity={0.03} />
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
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          transform: `scale(${scale})`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 1.08,
            letterSpacing: -3,
            color: "white",
            textAlign: "center",
            maxWidth: 1100,
          }}
        >
          <AnimatedText split="word" animation="fade-up" staggerFrames={5} durationPerUnit={18} delay={5} yOffset={40} blurAmount={6}>
            {hook}
          </AnimatedText>
        </h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BeforeScene: React.FC<{
  beforeState: string;
  painPoints: string[];
  problem: string;
  accentColor: string;
}> = ({ beforeState, painPoints, problem, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const shakeX = frame < 30
    ? interpolate(Math.sin(frame * 0.9), [-1, 1], [-3, 3])
    : 0;

  const redFlash = interpolate(frame, [0, 12, 24], [0, 0.1, 0], {
    extrapolateRight: "clamp",
  });

  const desaturation = interpolate(frame, [0, 20], [0.6, 0.85], {
    extrapolateRight: "clamp",
  });

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: `grayscale(${desaturation})` }}>
      <GradientBackground accentColor="#666666" variant="hook" />
      <Noise opacity={0.05} />

      <AbsoluteFill style={{ background: `rgba(255,40,40,${redFlash})`, pointerEvents: "none" }} />

      {/* BEFORE badge */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#FF4444",
            boxShadow: "0 0 12px #FF4444",
          }}
        />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 700,
            color: "#FF4444",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Before
        </span>
      </div>

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
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 58,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            letterSpacing: -2,
            lineHeight: 1.15,
            margin: 0,
            maxWidth: 900,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={20} delay={10} yOffset={28} blurAmount={5}>
            {beforeState}
          </AnimatedText>
        </h2>

        {problem ? (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: 750,
              opacity: interpolate(frame, [35, 55], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [35, 55], [12, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            {problem}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {painPoints.slice(0, 3).map((pain, i) => {
            const delay = 50 + i * 14;
            const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${interpolate(frame, [delay, delay + 18], [20, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px)`,
                  background: "rgba(255,60,60,0.08)",
                  border: "1px solid rgba(255,80,80,0.25)",
                  borderRadius: 14,
                  padding: "12px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>✕</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {pain}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WipeTransformScene: React.FC<{
  companyName: string;
  solution: string;
  accentColor: string;
}> = ({ companyName, solution, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const wipeProgress = interpolate(frame, [0, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const textOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textScale = interpolate(
    spring({ frame: frame - 70, fps, config: { damping: 14, stiffness: 100 } }),
    [0, 1],
    [0.7, 1]
  );

  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.2, 0.5]);

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {/* Old desaturated background behind wipe */}
      <GradientBackground accentColor="#666666" variant="hook" />

      {/* Colorful layer wiping in */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - wipeProgress}% 0 0)`,
        }}
      >
        <GradientBackground accentColor={accentColor} variant="intro" />
        <FloatingParticles count={30} color={`${accentColor}40`} seed={42} />
      </div>

      <Noise opacity={0.02} />

      <div
        style={{
          position: "absolute",
          width: "50%",
          height: "40%",
          left: "25%",
          top: "30%",
          background: `radial-gradient(ellipse, ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          opacity: textOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: textOpacity,
          transform: `scale(${textScale})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 15,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Introducing
        </span>
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 110,
            fontWeight: 800,
            margin: 0,
            letterSpacing: -4,
            lineHeight: 1,
            background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 60%, #FF5E68 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {companyName}
        </h1>
        {solution ? (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 24,
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: 800,
              opacity: interpolate(frame, [100, 120], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [100, 120], [15, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            {solution}
          </p>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const AfterScene: React.FC<{
  afterState: string;
  transformationSteps: string[];
  accentColor: string;
}> = ({ afterState, transformationSteps, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={18} color={`${accentColor}35`} seed={88} />
      <Noise opacity={0.02} />

      {/* AFTER badge */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#28CA42",
            boxShadow: "0 0 12px #28CA42",
          }}
        />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 700,
            color: "#28CA42",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          After
        </span>
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 36,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 62,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            letterSpacing: -2.5,
            lineHeight: 1.1,
            margin: 0,
            maxWidth: 900,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={20} delay={8} yOffset={30} blurAmount={5}>
            {afterState}
          </AnimatedText>
        </h2>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {transformationSteps.slice(0, 3).map((step, i) => {
            const delay = 40 + i * 12;
            const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
            const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${interpolate(cardSpring, [0, 1], [0.8, 1])})`,
                  background: `${accentColor}12`,
                  border: `1px solid ${accentColor}30`,
                  borderRadius: 14,
                  padding: "12px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 16, color: "#28CA42" }}>✓</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BridgeScene: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  accentColor: string;
}> = ({ features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 15], [0, 0.6], { extrapolateRight: "clamp" }),
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          How it works
        </span>
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 28,
        }}
      >
        {features.slice(0, 3).map((feature, i) => {
          const delay = 8 + i * 12;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
          const cardY = interpolate(cardSpring, [0, 1], [50, 0]);
          const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
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
                padding: "32px 28px",
                width: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                textAlign: "center",
              }}
            >
              <FeatureIcon icon={feature.icon} accentColor={accentColor} size={64} />
              <h4
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  margin: 0,
                }}
              >
                {feature.title}
              </h4>
              <p
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 14,
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

const CtaScene: React.FC<{
  companyName: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ companyName, cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inScale = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 120 } }),
    [0, 1],
    [0.88, 1]
  );
  const buttonOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });
  const buttonScale = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 100 } }),
    [0, 1],
    [0.7, 1]
  );
  const breathe = interpolate(Math.sin(frame * 0.07), [-1, 1], [1, 1.02]);
  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.6]);

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 65% 50% at 50% 48%, ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <FloatingParticles count={30} color={`${accentColor}40`} maxSize={4} seed={77} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          transform: `scale(${inScale})`,
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
            lineHeight: 1.08,
          }}
        >
          <AnimatedText split="word" animation="slam" staggerFrames={4} delay={5} yOffset={35}>
            {cta}
          </AnimatedText>
        </h2>
        <div style={{ transform: `scale(${buttonScale * breathe})`, opacity: buttonOpacity }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #FF5E68)`,
              borderRadius: 20,
              padding: "20px 56px",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              boxShadow: `0 18px 52px ${accentColor}55, 0 0 90px ${accentColor}18`,
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
            opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {websiteUrl}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BeforeAfterVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    hook,
    problem = "",
    beforeState = "Wasting hours on manual busywork every single day",
    afterState = "Shipping 10x faster with zero friction",
    painPoints = ["Manual workflows", "Broken spreadsheets", "Repetitive tasks"],
    transformationSteps = ["Automate tasks", "Real-time collab", "One-click deploy"],
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    solution = "",
  } = props;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene hook={hook} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <BeforeScene
            beforeState={beforeState}
            painPoints={painPoints}
            problem={problem}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={180}>
          <WipeTransformScene companyName={companyName} solution={solution} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <AfterScene
            afterState={afterState}
            transformationSteps={transformationSteps}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <BridgeScene features={features} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
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
