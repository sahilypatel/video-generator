import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { VideoProps } from "./types";
import { FloatingParticles } from "./components/FloatingParticles";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { AnimatedText } from "./components/AnimatedText";
import { Noise } from "./components/Noise";
import { FONT_SPACE_GROTESK, FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

export const TEMPLATE_28_FRAMES = 1050;

const DARK_BG = "#08070e";
const SURFACE = "#141220";
const BORDER = "#1f1d2e";
const MUTED = "#a09dae";

const MeshBackground: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.02) * 5;

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          left: "-20%",
          top: "-20%",
          background: `
            radial-gradient(ellipse 50% 40% at ${30 + drift}% ${35 - drift * 0.5}%, ${accentColor}18 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at ${70 - drift}% ${65 + drift * 0.3}%, #6366f115 0%, transparent 70%),
            radial-gradient(ellipse 35% 30% at 50% 50%, #ec489912 0%, transparent 70%)
          `,
          filter: "blur(40px)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 1: Title Card (90f) ─────────────────────────────────────────────
const TitleScene: React.FC<{
  companyName: string;
  tagline: string;
  accentColor: string;
  logoUrl?: string | null;
  logoText?: string;
}> = ({ companyName, tagline, accentColor, logoUrl, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 12, stiffness: 80, mass: 1.2 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.85, 1]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  const badgeOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 200 } }),
    [0, 1],
    [10, 0],
  );

  const badge = logoText || companyName.slice(0, 2).toUpperCase();

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <FloatingParticles count={14} color={`${accentColor}15`} seed={28} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          opacity: entryOpacity,
          transform: `scale(${entryScale})`,
        }}
      >
        {logoUrl ? (
          <Img src={logoUrl} style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 16 }} />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_SPACE_GROTESK,
              fontSize: 28,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            {badge}
          </div>
        )}

        <h1
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 88,
            fontWeight: 700,
            color: "white",
            margin: 0,
            letterSpacing: -4,
            textAlign: "center",
          }}
        >
          <AnimatedText split="word" staggerFrames={5} durationPerUnit={20} delay={8} yOffset={40} blurAmount={6}>
            {companyName}
          </AnimatedText>
        </h1>

        <p
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 26,
            fontWeight: 400,
            color: MUTED,
            margin: 0,
            textAlign: "center",
            maxWidth: 700,
            opacity: interpolate(frame, [25, 42], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {tagline}
        </p>

        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}40`,
            borderRadius: 10,
            padding: "8px 20px",
          }}
        >
          <span
            style={{
              fontFamily: FONT_SPACE_GROTESK,
              fontSize: 14,
              fontWeight: 600,
              color: accentColor,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Investor Update
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem (150f) ───────────────────────────────────────────────
const ProblemScene: React.FC<{
  problem: string;
  painPoints?: string[];
  accentColor: string;
}> = ({ problem, painPoints = [], accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: "0 120px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 14,
            fontWeight: 600,
            color: "#FF5E68",
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          The Problem
        </span>

        <h2
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 52,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.2,
            letterSpacing: -2,
          }}
        >
          <AnimatedText split="word" staggerFrames={3} durationPerUnit={18} delay={10} yOffset={25} blurAmount={4}>
            {problem}
          </AnimatedText>
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          {painPoints.slice(0, 4).map((point, i) => {
            const cardDelay = 40 + i * 12;
            const cardSpring = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 12, stiffness: 120 },
            });
            const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
            const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  background: SURFACE,
                  border: `1px solid #FF5E6830`,
                  borderRadius: 12,
                  padding: "14px 24px",
                  maxWidth: 360,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SPACE_GROTESK,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {point}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Solution + Features (150f) ───────────────────────────────────
const SolutionScene: React.FC<{
  companyName: string;
  solution: string;
  features: Array<{ icon: string; title: string; description: string }>;
  accentColor: string;
}> = ({ companyName, solution, features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 100px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 14,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          The Solution
        </span>

        <h2
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 48,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            margin: 0,
            maxWidth: 850,
            lineHeight: 1.2,
            letterSpacing: -2,
          }}
        >
          <AnimatedText split="word" staggerFrames={3} durationPerUnit={18} delay={10} yOffset={25} blurAmount={4}>
            {`${companyName}: ${solution}`}
          </AnimatedText>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 12,
            width: "100%",
            maxWidth: 760,
          }}
        >
          {features.slice(0, 4).map((feat, i) => {
            const cardDelay = 40 + i * 14;
            const cardSpring = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 12, stiffness: 120 },
            });
            const cardY = interpolate(cardSpring, [0, 1], [30, 0]);
            const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: "22px 24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${accentColor}18`,
                    border: `1px solid ${accentColor}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: FONT_SPACE_GROTESK,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                      marginBottom: 4,
                    }}
                  >
                    {feat.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 13,
                      color: MUTED,
                      margin: 0,
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

// ─── Scene 4: Traction / Stats (150f) ──────────────────────────────────────
const TractionScene: React.FC<{
  stats?: Array<{ label: string; value: string }>;
  awards?: string[];
  accentColor: string;
}> = ({ stats = [], awards = [], accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeStats = stats.length > 0
    ? stats.slice(0, 3)
    : [
        { label: "Active Users", value: "10,000+" },
        { label: "Revenue", value: "$1M" },
        { label: "Growth", value: "3x" },
      ];

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <FloatingParticles count={10} color={`${accentColor}12`} seed={44} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 100px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 14,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Traction
        </span>

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {safeStats.map((stat, i) => {
            const statDelay = 15 + i * 12;
            const statSpring = spring({
              frame: frame - statDelay,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const statScale = interpolate(statSpring, [0, 1], [0.7, 1]);
            const statOpacity = interpolate(statSpring, [0, 1], [0, 1]);

            const numericValue = parseFloat(stat.value.replace(/[^0-9.-]/g, "")) || 0;
            const prefix = stat.value.startsWith("$") ? "$" : "";
            const suffix = stat.value.replace(/[\d.,\s$]/g, "");

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  opacity: statOpacity,
                  transform: `scale(${statScale})`,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: "32px 48px",
                  minWidth: 200,
                }}
              >
                <AnimatedCounter
                  targetValue={numericValue}
                  prefix={prefix}
                  suffix={suffix}
                  delay={statDelay}
                  fontSize={52}
                  style={{ color: "white", fontFamily: FONT_SPACE_GROTESK }}
                />
                <span
                  style={{
                    fontFamily: FONT_SPACE_GROTESK,
                    fontSize: 14,
                    fontWeight: 500,
                    color: MUTED,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>

        {awards.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            {awards.slice(0, 3).map((award, i) => {
              const awardDelay = 70 + i * 10;
              const awardOpacity = interpolate(frame, [awardDelay, awardDelay + 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: awardOpacity,
                    background: `${accentColor}15`,
                    border: `1px solid ${accentColor}30`,
                    borderRadius: 10,
                    padding: "8px 20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_SPACE_GROTESK,
                      fontSize: 13,
                      fontWeight: 600,
                      color: accentColor,
                    }}
                  >
                    🏆 {award}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Social Proof (150f) ──────────────────────────────────────────
const SocialProofScene: React.FC<{
  testimonialQuote?: string;
  testimonialAuthor?: string;
  proofLogos?: string[];
  accentColor: string;
}> = ({ testimonialQuote, testimonialAuthor, proofLogos = [], accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteSpring = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 80 } });
  const quoteScale = interpolate(quoteSpring, [0, 1], [0.9, 1]);
  const quoteOpacity = interpolate(quoteSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: "0 140px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 14,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Social Proof
        </span>

        {testimonialQuote && (
          <div
            style={{
              opacity: quoteOpacity,
              transform: `scale(${quoteScale})`,
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              padding: "40px 48px",
              maxWidth: 800,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 16,
                left: 24,
                fontSize: 48,
                color: `${accentColor}40`,
                fontFamily: "Georgia, serif",
                lineHeight: 1,
              }}
            >
              &ldquo;
            </span>
            <p
              style={{
                fontFamily: FONT_SPACE_GROTESK,
                fontSize: 26,
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                margin: 0,
                lineHeight: 1.5,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {testimonialQuote}
            </p>
            {testimonialAuthor && (
              <p
                style={{
                  fontFamily: FONT_SPACE_GROTESK,
                  fontSize: 15,
                  fontWeight: 600,
                  color: MUTED,
                  margin: 0,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                — {testimonialAuthor}
              </p>
            )}
          </div>
        )}

        {proofLogos.length > 0 && (
          <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
            {proofLogos.slice(0, 5).map((logo, i) => {
              const logoDelay = 60 + i * 8;
              const logoSpring = spring({
                frame: frame - logoDelay,
                fps,
                config: { damping: 14, stiffness: 140 },
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: interpolate(logoSpring, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(logoSpring, [0, 1], [0.7, 1])})`,
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "10px 24px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_SPACE_GROTESK,
                      fontSize: 14,
                      fontWeight: 600,
                      color: MUTED,
                    }}
                  >
                    {logo}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Market Size (120f) ───────────────────────────────────────────
const MarketSizeScene: React.FC<{
  bigStat?: string;
  accentColor: string;
}> = ({ bigStat = "$50B", accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numMatch = bigStat.match(/[\d,.]+/);
  const numericValue = numMatch ? parseFloat(numMatch[0].replace(/,/g, "")) : 50;
  const prefix = bigStat.match(/^[^0-9]*/)?.[0] || "";
  const suffix = bigStat.match(/[^0-9,.]*$/)?.[0] || "";

  const scaleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 80, mass: 1.5 } });
  const scale = interpolate(scaleSpring, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <Noise opacity={0.02} />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 14,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Market Opportunity
        </span>

        <div style={{ transform: `scale(${scale})` }}>
          <AnimatedCounter
            targetValue={numericValue}
            prefix={prefix}
            suffix={suffix}
            delay={5}
            fontSize={120}
            style={{
              color: "white",
              fontFamily: FONT_SPACE_GROTESK,
              fontWeight: 700,
              letterSpacing: -4,
            }}
          />
        </div>

        <p
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 22,
            fontWeight: 400,
            color: MUTED,
            margin: 0,
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Total Addressable Market
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 7: CTA (120f) ──────────────────────────────────────────────────
const CTAScene: React.FC<{
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1]);

  const btn1Spring = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 120 } });
  const btn1Scale = interpolate(btn1Spring, [0, 1], [0.6, 1]);
  const btn1Opacity = interpolate(btn1Spring, [0, 1], [0, 1]);

  const btn2Spring = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 120 } });
  const btn2Scale = interpolate(btn2Spring, [0, 1], [0.6, 1]);
  const btn2Opacity = interpolate(btn2Spring, [0, 1], [0, 1]);

  const urlOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
      <FloatingParticles count={18} color={`${accentColor}20`} seed={77} />
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
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            margin: 0,
            textAlign: "center",
            letterSpacing: -2,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={18} delay={5} yOffset={30} blurAmount={5}>
            {cta}
          </AnimatedText>
        </h2>

        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              opacity: btn1Opacity,
              transform: `scale(${btn1Scale})`,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              borderRadius: 14,
              padding: "16px 40px",
              fontFamily: FONT_SPACE_GROTESK,
              fontSize: 18,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            Get in Touch
          </div>
          <div
            style={{
              opacity: btn2Opacity,
              transform: `scale(${btn2Scale})`,
              background: "transparent",
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: "16px 40px",
              fontFamily: FONT_SPACE_GROTESK,
              fontSize: 18,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Learn More
          </div>
        </div>

        <p
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 18,
            fontWeight: 500,
            color: `${accentColor}aa`,
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

// ─── Scene 8: End Card (120f) ──────────────────────────────────────────────
const EndCardScene: React.FC<{
  companyName: string;
  accentColor: string;
  logoUrl?: string | null;
  logoText?: string;
}> = ({ companyName, accentColor, logoUrl, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const nameOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badge = logoText || companyName.slice(0, 2).toUpperCase();

  return (
    <AbsoluteFill>
      <MeshBackground accentColor={accentColor} />
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
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
          {logoUrl ? (
            <Img src={logoUrl} style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 20 }} />
          ) : (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_SPACE_GROTESK,
                fontSize: 36,
                fontWeight: 700,
                color: DARK_BG,
                boxShadow: `0 0 60px ${accentColor}40`,
              }}
            >
              {badge}
            </div>
          )}
        </div>

        <h2
          style={{
            fontFamily: FONT_SPACE_GROTESK,
            fontSize: 48,
            fontWeight: 700,
            color: "white",
            margin: 0,
            opacity: nameOpacity,
            letterSpacing: -2,
          }}
        >
          {companyName}
        </h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────
export const PitchDeckVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    problem,
    solution,
    features = [],
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
    painPoints,
    stats,
    awards,
    testimonialQuote,
    testimonialAuthor,
    proofLogos,
    bigStat,
  } = props;

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <TransitionSeries>
        {/* Scene 1: Title */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <TitleScene companyName={companyName} tagline={tagline} accentColor={accentColor} logoUrl={logoUrl} logoText={logoText} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Problem */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <ProblemScene problem={problem} painPoints={painPoints} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 3: Solution */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SolutionScene companyName={companyName} solution={solution} features={features} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 4: Traction */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <TractionScene stats={stats} awards={awards} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 5: Social Proof */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SocialProofScene
            testimonialQuote={testimonialQuote}
            testimonialAuthor={testimonialAuthor}
            proofLogos={proofLogos}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Scene 6: Market Size */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <MarketSizeScene bigStat={bigStat} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 7: CTA */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <CTAScene cta={cta} websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 8: End Card */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <EndCardScene companyName={companyName} accentColor={accentColor} logoUrl={logoUrl} logoText={logoText} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
