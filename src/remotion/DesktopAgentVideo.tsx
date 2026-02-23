import React from "react";
import {
  AbsoluteFill,
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
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

// 125+155+180+150+150+125 = 885 raw – 5×15 = 810 frames ≈ 27s
export const TEMPLATE_18_FRAMES = 810;

const DARK_BG = "#0c0a09";
const SURFACE = "#1c1917";
const BORDER = "#292524";
const WHITE_TEXT = "#fafaf9";
const MUTED = "#a8a29e";
const DIM = "#78716c";
const MONO_FONT = "'SF Mono', 'Fira Code', 'Cascadia Code', monospace";
const SERIF_FONT = "Georgia, 'Times New Roman', serif";

const AppWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  accentColor: string;
}> = ({ children, title, accentColor }) => {
  return (
    <div
      style={{
        width: 920,
        maxHeight: 580,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${BORDER}`,
        background: SURFACE,
        boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 60px ${accentColor}10`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 36,
          background: "linear-gradient(180deg, #292524 0%, #1c1917 100%)",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          gap: 7,
          flexShrink: 0,
        }}
      >
        {["#FF5F57", "#FFBD2E", "#28CA41"].map((c, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
            }}
          />
        ))}
        {title && (
          <span
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: FONT_FAMILY,
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              paddingRight: 40,
            }}
          >
            {title}
          </span>
        )}
      </div>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>
  );
};

// ─── Scene 1: Product Intro (125f) ─────────────────────────────────────────
const ProductIntroScene: React.FC<{
  companyName: string;
  tagline: string;
  hook?: string;
  accentColor: string;
  logoText?: string;
}> = ({ companyName, tagline, hook, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1.2 },
  });
  const slideY = interpolate(entrySpring, [0, 1], [200, 0]);
  const rotateX = interpolate(entrySpring, [0, 1], [20, 0]);
  const rotateYOsc = Math.sin(frame * 0.06) * 1.5;
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  const nameChars = Math.min(
    companyName.length,
    Math.floor((frame - 15) * 1.5),
  );
  const showName = frame > 15;
  const nameDone = nameChars >= companyName.length;
  const cursorBlink = Math.sin(frame * 0.25) > 0;

  const tagDelay = Math.ceil(companyName.length / 1.5) + 25;
  const tagOpacity = interpolate(frame, [tagDelay, tagDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookDelay = tagDelay + 15;
  const hookOpacity = interpolate(frame, [hookDelay, hookDelay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badge = logoText || companyName.slice(0, 2).toUpperCase();

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <FloatingParticles count={12} color={`${accentColor}18`} seed={42} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
        }}
      >
        <div
          style={{
            opacity: entryOpacity,
            transform: `translateY(${slideY}px) rotateX(${rotateX}deg) rotateY(${rotateYOsc}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <AppWindow title={companyName} accentColor={accentColor}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "56px 60px",
                gap: 24,
                minHeight: 380,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: 24,
                  fontWeight: 800,
                  color: DARK_BG,
                  opacity: interpolate(frame, [5, 14], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {badge}
              </div>

              {showName && (
                <h1
                  style={{
                    margin: 0,
                    fontFamily: SERIF_FONT,
                    fontWeight: 700,
                    fontSize: 52,
                    color: WHITE_TEXT,
                    letterSpacing: -1,
                  }}
                >
                  {companyName.slice(0, Math.max(0, nameChars))}
                  {!nameDone && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 3,
                        height: 48,
                        background: cursorBlink ? accentColor : "transparent",
                        marginLeft: 2,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </h1>
              )}

              <p
                style={{
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: MUTED,
                  textAlign: "center",
                  opacity: tagOpacity,
                  maxWidth: 500,
                }}
              >
                {tagline}
              </p>
              {hook ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                    fontSize: 20,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.42)",
                    textAlign: "center",
                    opacity: hookOpacity,
                    maxWidth: 500,
                  }}
                >
                  {hook}
                </p>
              ) : null}
            </div>
          </AppWindow>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Product Overview (155f) ──────────────────────────────────────
const ProductOverviewScene: React.FC<{
  companyName: string;
  solution: string;
  problem?: string;
  accentColor: string;
}> = ({ companyName, solution, problem, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1 },
  });
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  const textOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const problemOpacity = interpolate(frame, [12, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: entryOpacity,
        }}
      >
        <AppWindow title={companyName} accentColor={accentColor}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              padding: "32px 48px",
              gap: 24,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 700,
                height: 260,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${DARK_BG}, ${SURFACE})`,
                  border: `1px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: interpolate(frame, [8, 22], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    padding: 24,
                    width: "100%",
                  }}
                >
                  {[0, 1, 2, 3].map((i) => {
                    const boxDelay = 12 + i * 6;
                    const boxOpacity = interpolate(
                      frame,
                      [boxDelay, boxDelay + 10],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    );
                    return (
                      <div
                        key={i}
                        style={{
                          height: 80,
                          borderRadius: 10,
                          background: i === 0 ? `${accentColor}15` : `${BORDER}60`,
                          border: `1px solid ${i === 0 ? `${accentColor}30` : BORDER}`,
                          opacity: boxOpacity,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

            {problem ? (
              <p
                style={{
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  fontWeight: 400,
                  color: MUTED,
                  textAlign: "center",
                  maxWidth: 600,
                  lineHeight: 1.5,
                  opacity: problemOpacity,
                }}
              >
                {problem}
              </p>
            ) : null}
            <p
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                color: WHITE_TEXT,
                textAlign: "center",
                maxWidth: 600,
                lineHeight: 1.5,
                opacity: textOpacity,
              }}
            >
              {solution}
            </p>
          </div>
        </AppWindow>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Feature Panels (180f) ────────────────────────────────────────
const FeaturePanelsScene: React.FC<{
  companyName: string;
  accentColor: string;
  features: Array<{ icon: string; title: string; description: string }>;
}> = ({ companyName, accentColor, features }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <FloatingParticles count={10} color={`${accentColor}12`} seed={77} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: entryOpacity,
        }}
      >
        <AppWindow title={`${companyName} — Features`} accentColor={accentColor}>
          <div
            style={{
              padding: "36px 40px",
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 700,
                color: WHITE_TEXT,
                textAlign: "center",
                opacity: interpolate(frame, [5, 18], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              What&apos;s Inside
            </h2>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
              }}
            >
              {features.slice(0, 3).map((feat, i) => {
                const cardDelay = 20 + i * 18;
                const cardSpring = spring({
                  frame: frame - cardDelay,
                  fps,
                  config: { damping: 12, stiffness: 120 },
                });
                const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
                const cardY = interpolate(cardSpring, [0, 1], [40, 0]);
                const cardScale = interpolate(cardSpring, [0, 1], [0.9, 1]);

                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      opacity: cardOpacity,
                      transform: `translateY(${cardY}px) scale(${cardScale})`,
                      background: DARK_BG,
                      borderRadius: 14,
                      border: `1px solid ${BORDER}`,
                      padding: "28px 22px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${accentColor}15`,
                        border: `1px solid ${accentColor}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {feat.icon}
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: FONT_FAMILY,
                          fontSize: 15,
                          fontWeight: 700,
                          color: WHITE_TEXT,
                          marginBottom: 6,
                        }}
                      >
                        {feat.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: FONT_FAMILY,
                          fontSize: 12,
                          color: MUTED,
                          lineHeight: 1.5,
                        }}
                      >
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AppWindow>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: How It Works (150f) ──────────────────────────────────────────
const HowItWorksScene: React.FC<{
  accentColor: string;
  features: Array<{ icon: string; title: string; description: string }>;
}> = ({ accentColor, features }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = features.slice(0, 3);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
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
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 36,
            color: WHITE_TEXT,
            textAlign: "center",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {steps.map((step, i) => {
            const stepDelay = 18 + i * 22;
            const stepSpring = spring({
              frame: frame - stepDelay,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const stepOpacity = interpolate(stepSpring, [0, 1], [0, 1]);
            const stepScale = interpolate(stepSpring, [0, 1], [0.8, 1]);

            const arrowDelay = stepDelay + 15;
            const arrowOpacity = interpolate(
              frame,
              [arrowDelay, arrowDelay + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    opacity: stepOpacity,
                    transform: `scale(${stepScale})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                    width: 220,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: SURFACE,
                      border: `1px solid ${BORDER}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{step.icon}</span>
                    <div
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: accentColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: FONT_FAMILY,
                        fontSize: 11,
                        fontWeight: 800,
                        color: DARK_BG,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: FONT_FAMILY,
                      fontSize: 15,
                      fontWeight: 700,
                      color: WHITE_TEXT,
                      textAlign: "center",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: FONT_FAMILY,
                      fontSize: 12,
                      color: MUTED,
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div
                    style={{
                      opacity: arrowOpacity,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      marginBottom: 40,
                    }}
                  >
                    <svg width="40" height="16" viewBox="0 0 40 16">
                      <line
                        x1="0"
                        y1="8"
                        x2="30"
                        y2="8"
                        stroke={accentColor}
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      <polygon
                        points="28,3 38,8 28,13"
                        fill={accentColor}
                      />
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

// ─── Scene 5: Social Proof (150f) ──────────────────────────────────────────
const SocialProofScene: React.FC<{
  accentColor: string;
  proofMetric?: string;
  proofLogos?: string[];
  companyName: string;
}> = ({ accentColor, proofMetric, proofLogos = [], companyName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const metricNum = proofMetric?.match(/[\d,]+/)?.[0]?.replace(/,/g, "") ?? "";
  const metricSuffix = proofMetric?.replace(/[\d,]+/, "") ?? "";
  const targetNum = parseInt(metricNum) || 500;
  const displayNum = Math.min(
    targetNum,
    Math.floor(
      interpolate(frame, [15, 55], [0, targetNum], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  const pulseDotScale = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.85, 1.15]);
  const pulseDotGlow = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.25, 0.65]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <FloatingParticles count={10} color={`${accentColor}12`} seed={55} />
      <Noise opacity={0.02} />

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
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 34,
            color: WHITE_TEXT,
            textAlign: "center",
            opacity: interpolate(frame, [5, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Trusted by Teams Everywhere
        </h2>

        {proofMetric && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: SURFACE,
              borderRadius: 16,
              border: `1px solid ${BORDER}`,
              padding: "20px 36px",
              opacity: interpolate(frame, [12, 25], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#28CA41",
                boxShadow: `0 0 12px rgba(40,202,65,${pulseDotGlow})`,
                transform: `scale(${pulseDotScale})`,
              }}
            />
            <span
              style={{
                fontFamily: MONO_FONT,
                fontSize: 40,
                fontWeight: 800,
                color: accentColor,
              }}
            >
              {displayNum.toLocaleString()}{metricSuffix}
            </span>
          </div>
        )}

        {proofLogos.length > 0 && (
          <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
            {proofLogos.slice(0, 5).map((logo, i) => {
              const logoDelay = 35 + i * 8;
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
                    padding: "10px 24px",
                    borderRadius: 10,
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
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

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            color: DIM,
            textAlign: "center",
            opacity: interpolate(frame, [70, 85], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {companyName} powers teams across every industry
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (125f) ──────────────────────────────────────────────────
const CTAScene: React.FC<{
  companyName: string;
  cta: string;
  websiteUrl: string;
  accentColor: string;
  logoText?: string;
}> = ({ companyName, cta, websiteUrl, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const entryScale = interpolate(entrySpring, [0, 1], [0.92, 1]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.04]);
  const badge = logoText || companyName.slice(0, 2).toUpperCase();

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <FloatingParticles count={16} color={`${accentColor}18`} seed={123} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${BORDER}30 1px, transparent 1px), linear-gradient(90deg, ${BORDER}30 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          opacity: 0.2,
        }}
      />

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
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            fontWeight: 800,
            color: DARK_BG,
          }}
        >
          {badge}
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 42,
            color: WHITE_TEXT,
            textAlign: "center",
            transform: `scale(${pulse})`,
          }}
        >
          {cta}
        </h2>

        <div
          style={{
            padding: "14px 40px",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
            fontFamily: FONT_FAMILY,
            fontSize: 16,
            fontWeight: 700,
            color: DARK_BG,
            transform: `scale(${pulse})`,
            opacity: interpolate(frame, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Get Started Free
        </div>

        <div
          style={{
            background: SURFACE,
            borderRadius: 12,
            border: `1px solid ${BORDER}`,
            padding: "12px 28px",
            fontFamily: MONO_FONT,
            fontSize: 15,
            color: MUTED,
            opacity: interpolate(frame, [35, 50], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {websiteUrl}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────
export const DesktopAgentVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    hook = "",
    problem = "",
    solution,
    features = [],
    cta,
    websiteUrl,
    accentColor,
    logoText,
    proofMetric,
    proofLogos,
  } = props;

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={125}>
          <ProductIntroScene
            companyName={companyName}
            tagline={tagline}
            hook={hook}
            accentColor={accentColor}
            logoText={logoText}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={155}>
          <ProductOverviewScene
            companyName={companyName}
            solution={solution}
            problem={problem}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={180}>
          <FeaturePanelsScene
            companyName={companyName}
            accentColor={accentColor}
            features={features}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <HowItWorksScene
            accentColor={accentColor}
            features={features}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <SocialProofScene
            accentColor={accentColor}
            proofMetric={proofMetric}
            proofLogos={proofLogos}
            companyName={companyName}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={125}>
          <CTAScene
            companyName={companyName}
            cta={cta}
            websiteUrl={websiteUrl}
            accentColor={accentColor}
            logoText={logoText}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
