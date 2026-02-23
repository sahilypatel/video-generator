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
import { VideoProps } from "./types";
import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { FeatureIcon } from "./components/FeatureIcon";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

// Tease(90) + Intrigue(180) + Reveal(270) + Payoff(240) + CTA(150) - 4*15 = 870
export const TEMPLATE_14_FRAMES = 870;

const TeaseScene: React.FC<{
  teaseStat: string;
  hook?: string;
  accentColor: string;
}> = ({ teaseStat, hook, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const blurAmount = interpolate(frame, [0, 50, 70], [20, 0, 0], {
    extrapolateRight: "clamp",
  });

  const statScale = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 160 } }),
    [0, 1],
    [0.5, 1],
  );

  const questionMarks = Array.from({ length: 8 });
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={16} color="rgba(255,255,255,0.12)" seed={14} />
      <Noise opacity={0.03} />

      {/* Floating question marks */}
      {questionMarks.map((_, i) => {
        const seed = i * 137.5;
        const x = 15 + ((seed * 7.3) % 70);
        const baseY = 10 + ((seed * 3.7) % 75);
        const floatY = Math.sin((frame + seed) * 0.04) * 15;
        const qOpacity = interpolate(
          frame,
          [i * 6, i * 6 + 20],
          [0, 0.12],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${baseY}%`,
              transform: `translateY(${floatY}px) rotate(${(seed % 40) - 20}deg)`,
              fontFamily: FONT_FAMILY,
              fontSize: 48 + (seed % 30),
              fontWeight: 800,
              color: accentColor,
              opacity: qOpacity,
              pointerEvents: "none",
            }}
          >
            ?
          </span>
        );
      })}

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: `blur(${blurAmount}px)`,
        }}
      >
        <div
          style={{
            transform: `scale(${statScale})`,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 130,
              fontWeight: 800,
              color: "white",
              margin: 0,
              letterSpacing: -5,
              lineHeight: 1,
              textShadow: `0 0 60px ${accentColor}60`,
            }}
          >
            {teaseStat}
          </h1>
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              margin: "16px 0 0",
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: interpolate(frame, [40, 55], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            But how?
          </p>
          {hook ? (
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(255,255,255,0.35)",
                margin: "12px 0 0",
                textAlign: "center",
                opacity: interpolate(frame, [50, 68], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {hook}
            </p>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const IntrigueScene: React.FC<{
  intrigueItems: string[];
  problem?: string;
  accentColor: string;
}> = ({ intrigueItems, problem, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "0 140px",
        }}
      >
        {intrigueItems.slice(0, 3).map((item, i) => {
          const enterDelay = i * 40;
          const strikeDelay = enterDelay + 30;

          const itemOpacity = interpolate(
            frame,
            [enterDelay, enterDelay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const itemY = interpolate(
            spring({
              frame: frame - enterDelay,
              fps,
              config: { damping: 15, stiffness: 120 },
            }),
            [0, 1],
            [40, 0],
          );

          const strikeWidth = interpolate(
            frame,
            [strikeDelay, strikeDelay + 20],
            [0, 100],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            },
          );

          const textDim = interpolate(
            frame,
            [strikeDelay, strikeDelay + 20],
            [0.9, 0.35],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateY(${itemY}px)`,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 44,
                  fontWeight: 700,
                  color: `rgba(255,255,255,${textDim})`,
                  letterSpacing: -1,
                }}
              >
                {item}
              </span>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  height: 4,
                  width: `${strikeWidth}%`,
                  background: "#FF4444",
                  borderRadius: 2,
                  transform: "translateY(-50%)",
                  boxShadow: "0 0 8px rgba(255,68,68,0.5)",
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
      {problem ? (
        <p
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            fontWeight: 400,
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            margin: 0,
            opacity: interpolate(frame, [130, 150], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {problem}
        </p>
      ) : null}
    </AbsoluteFill>
  );
};

const RevealScene: React.FC<{
  companyName: string;
  solution: string;
  tagline?: string;
  accentColor: string;
}> = ({ companyName, solution, tagline, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rotateY = interpolate(
    spring({
      frame: frame - 15,
      fps,
      config: { damping: 10, stiffness: 60, mass: 1.5 },
    }),
    [0, 1],
    [90, 0],
  );

  const productScale = interpolate(
    spring({
      frame: frame - 15,
      fps,
      config: { damping: 14, stiffness: 80 },
    }),
    [0, 1],
    [0.6, 1],
  );

  const productOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringCount = 3;
  const rings = Array.from({ length: ringCount });

  const textDelay = 80;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 20], [0, 1], {
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
      <FloatingParticles count={20} color={`${accentColor}30`} seed={14} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Expanding rings */}
          {rings.map((_, i) => {
            const ringDelay = 40 + i * 15;
            const ringScale = interpolate(
              frame,
              [ringDelay, ringDelay + 40],
              [0.8, 1.8 + i * 0.5],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const ringOpacity = interpolate(
              frame,
              [ringDelay, ringDelay + 15, ringDelay + 40],
              [0, 0.4, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  border: `2px solid ${accentColor}`,
                  transform: `translate(-50%, -50%) scale(${ringScale})`,
                  opacity: ringOpacity,
                  pointerEvents: "none",
                }}
              />
            );
          })}

          <div
            style={{
              opacity: productOpacity,
              transform: `rotateY(${rotateY}deg) scale(${productScale})`,
              transformStyle: "preserve-3d",
              width: 400,
              height: 400,
              borderRadius: 40,
              background: `linear-gradient(145deg, ${accentColor}20 0%, rgba(255,255,255,0.06) 100%)`,
              border: `2px solid ${accentColor}40`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              boxShadow: `0 40px 100px rgba(0,0,0,0.4), 0 0 60px ${accentColor}20`,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 28,
                background: `linear-gradient(135deg, ${accentColor}60, ${accentColor}25)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
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
                fontSize: 44,
                color: "white",
                letterSpacing: -2,
              }}
            >
              {companyName}
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            margin: 0,
          }}
        >
          <AnimatedText
            split="word"
            staggerFrames={3}
            delay={textDelay + 5}
            yOffset={15}
          >
            {solution}
          </AnimatedText>
        </p>
        {tagline ? (
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
              margin: "12px 0 0",
              opacity: interpolate(
                frame,
                [textDelay + 25, textDelay + 40],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          >
            {tagline}
          </p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const PayoffScene: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  proofMetric: string;
  accentColor: string;
}> = ({ features, proofMetric, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const metricNum = proofMetric.replace(/[^0-9]/g, "");
  const metricSuffix = proofMetric.replace(/[0-9,]/g, "").trim();
  const target = parseInt(metricNum, 10) || 500;
  const counter = Math.round(
    interpolate(frame, [120, 200], [0, target], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  const counterOpacity = interpolate(frame, [110, 125], [0, 1], {
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
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {features.slice(0, 3).map((feature, i) => {
            const delay = 8 + i * 18;
            const cardSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 120 },
            });
            const cardScale = interpolate(cardSpring, [0, 1], [0.7, 1]);
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
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${accentColor}25`,
                  borderRadius: 24,
                  padding: "28px 24px",
                  width: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <FeatureIcon
                  icon={feature.icon}
                  accentColor={accentColor}
                  size={56}
                />
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
        </div>

        {/* Live counter */}
        <div
          style={{
            opacity: counterOpacity,
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              fontWeight: 700,
              color: accentColor,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Live users
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: -2,
            }}
          >
            {counter.toLocaleString()}
            {metricSuffix}
          </span>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#28CA42",
              boxShadow: "0 0 8px #28CA42",
              opacity: interpolate(
                Math.sin(frame * 0.15),
                [-1, 1],
                [0.4, 1],
              ),
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryScale = interpolate(
    spring({ frame, fps, config: { damping: 13, stiffness: 120 } }),
    [0, 1],
    [0.9, 1],
  );
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.03]);

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <FloatingParticles count={24} color={`${accentColor}35`} seed={14} />
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
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 84,
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
        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 20,
            color: `${accentColor}cc`,
            opacity: interpolate(frame, [45, 60], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {websiteUrl}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CuriosityLoopVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    solution,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    tagline = "",
    hook = "",
    problem = "",
    teaseStat = "10x faster",
    intrigueItems = [
      "It's not another project manager",
      "It's not a glorified spreadsheet",
      "It's not just another dashboard",
    ],
    proofMetric = "500+ teams",
  } = props;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <TeaseScene
            teaseStat={teaseStat}
            hook={hook}
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

        <TransitionSeries.Sequence durationInFrames={180}>
          <IntrigueScene
            intrigueItems={intrigueItems}
            problem={problem}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={270}>
          <RevealScene
            companyName={companyName}
            solution={solution}
            tagline={tagline}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={240}>
          <PayoffScene
            features={features}
            proofMetric={proofMetric}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <CtaScene
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
