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
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { LogoWatermark } from "./components/LogoWatermark";
import { SFX } from "./components/SFX";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { FONT_FAMILY } from "./fonts";

// Frame budget (30 fps):
// Scene 1 Hook:       90f   trans:15f
// Scene 2 Old Way:   180f   trans:15f
// Scene 3 VS:         30f   trans:15f
// Scene 4 New Way:   180f   trans:15f
// Scene 5 Grid:      120f   trans:15f
// Scene 6 Reveal:    120f   trans:15f
// Scene 7 CTA:       120f
// Sum: 90+180+30+180+120+120+120 = 840
// Trans: 6×15 = 90
// Net: 840 - 90 = 750 frames = 25s
export const TEMPLATE_22_FRAMES = 750;

const TRANS = 15;

const DarkBase: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.85, 1.15]);

  return (
    <AbsoluteFill style={{ background: "#0A0A10", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          left: "20%",
          top: "15%",
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(90px)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 1: Hook (90f) ──────────────────────────────────────────────────
const HookScene: React.FC<{
  hook: string;
  accentColor: string;
}> = ({ hook, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slamSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  });
  const slamScale = interpolate(slamSpring, [0, 1], [1.6, 1]);
  const slamOpacity = interpolate(slamSpring, [0, 1], [0, 1]);

  const flash = interpolate(frame, [0, 3, 10], [0.8, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(
    spring({ frame: frame - 8, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 300],
  );

  return (
    <AbsoluteFill>
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={20} color="rgba(255,255,255,0.08)" seed={22} />
      <Noise opacity={0.03} />

      <AbsoluteFill
        style={{ background: "white", opacity: flash, pointerEvents: "none" }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "0 120px",
        }}
      >
        <div
          style={{
            width: lineWidth,
            height: 4,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            borderRadius: 2,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 96,
            lineHeight: 1.05,
            letterSpacing: -4,
            color: "white",
            textAlign: "center",
            opacity: slamOpacity,
            transform: `scale(${slamScale})`,
          }}
        >
          <AnimatedText
            split="word"
            animation="slam"
            staggerFrames={5}
            delay={2}
            blurAmount={8}
          >
            {hook}
          </AnimatedText>
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: The Old Way (180f) ──────────────────────────────────────────
const OldWayScene: React.FC<{
  painPoints: string[];
}> = ({ painPoints }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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
      <AbsoluteFill style={{ background: "#0A0A10", overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(255,40,40,0.06) 0%, transparent 60%)",
          }}
        />
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </AbsoluteFill>
      <Noise opacity={0.03} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 120px",
          gap: 20,
          filter: "saturate(0.6)",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "rgba(255,80,80,0.8)",
            opacity: titleOpacity,
          }}
        >
          The Old Way
        </span>

        <div
          style={{
            width: 60,
            height: 3,
            background: "rgba(255,60,60,0.5)",
            borderRadius: 2,
            opacity: titleOpacity,
          }}
        />

        {painPoints.slice(0, 4).map((point, i) => {
          const delay = 20 + i * 28;
          const slideSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 16, stiffness: 90, mass: 1 },
          });
          const slideX = interpolate(slideSpring, [0, 1], [-400, 0]);
          const itemOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateX(${slideX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 32px",
                borderRadius: 16,
                background: "rgba(255,40,40,0.05)",
                border: "1px solid rgba(255,60,60,0.2)",
                maxWidth: 800,
                width: "100%",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,60,60,0.12)",
                  border: "1px solid rgba(255,60,60,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                ✕
              </div>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 30,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: -0.5,
                }}
              >
                {point}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: VS Divider (30f) ────────────────────────────────────────────
const VSDividerScene: React.FC<{
  accentColor: string;
}> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vsSpring = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.6 },
  });
  const vsScale = interpolate(vsSpring, [0, 1], [3, 1]);
  const vsOpacity = interpolate(vsSpring, [0, 0.3], [0, 1]);

  const lineHeight = interpolate(
    spring({ frame: frame - 5, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 600],
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#0A0A10" }} />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 3,
            height: lineHeight,
            background: `linear-gradient(to bottom, transparent, ${accentColor}60, transparent)`,
            position: "absolute",
          }}
        />
        <div
          style={{
            opacity: vsOpacity,
            transform: `scale(${vsScale})`,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 120,
            letterSpacing: 8,
            color: "white",
            textShadow: `0 0 60px ${accentColor}80`,
          }}
        >
          VS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: The New Way (180f) ──────────────────────────────────────────
const NewWayScene: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  accentColor: string;
}> = ({ features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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
      <AbsoluteFill style={{ background: "#0A0A10", overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${accentColor}0c 0%, transparent 60%)`,
          }}
        />
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </AbsoluteFill>
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "0 120px",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: `${accentColor}cc`,
            opacity: titleOpacity,
          }}
        >
          The New Way
        </span>

        <div
          style={{
            width: 60,
            height: 3,
            background: `${accentColor}80`,
            borderRadius: 2,
            opacity: titleOpacity,
          }}
        />

        {features.slice(0, 4).map((feat, i) => {
          const delay = 20 + i * 28;
          const entrySpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.8 },
          });
          const entryScale = interpolate(entrySpring, [0, 1], [0.7, 1]);
          const itemOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `scale(${entryScale})`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 32px",
                borderRadius: 16,
                background: `${accentColor}08`,
                border: `1px solid ${accentColor}25`,
                maxWidth: 800,
                width: "100%",
                flexDirection: "row-reverse",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  textAlign: "right",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: 28,
                    color: "white",
                    letterSpacing: -0.5,
                  }}
                >
                  {feat.title}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 400,
                    fontSize: 16,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {feat.description}
                </span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Side-by-Side Comparison Grid (120f) ─────────────────────────
const ComparisonGridScene: React.FC<{
  painPoints: string[];
  features: Array<{ title: string }>;
  accentColor: string;
}> = ({ painPoints, features, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const rows = Array.from({ length: 3 }, (_, i) => ({
    old: painPoints[i] ?? `Pain point ${i + 1}`,
    newItem: features[i]?.title ?? `Feature ${i + 1}`,
  }));

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 200,
            opacity: headerOpacity,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,80,80,0.7)",
            }}
          >
            Before
          </span>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: `${accentColor}bb`,
            }}
          >
            After
          </span>
        </div>

        {rows.map((row, i) => {
          const delay = 15 + i * 25;
          const rowSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          const rowScale = interpolate(rowSpring, [0, 1], [0.85, 1]);
          const rowOpacity = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: rowOpacity,
                transform: `scale(${rowScale})`,
                display: "flex",
                alignItems: "center",
                gap: 28,
                width: "100%",
                maxWidth: 1200,
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "22px 28px",
                  borderRadius: 14,
                  background: "rgba(255,40,40,0.04)",
                  border: "1px solid rgba(255,60,60,0.15)",
                }}
              >
                <span style={{ fontSize: 22, color: "rgba(255,80,80,0.8)" }}>
                  ✕
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 500,
                    fontSize: 22,
                    color: "rgba(255,255,255,0.6)",
                    letterSpacing: -0.3,
                  }}
                >
                  {row.old}
                </span>
              </div>

              <div
                style={{
                  width: 2,
                  height: 50,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 1,
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "22px 28px",
                  borderRadius: 14,
                  background: `${accentColor}06`,
                  border: `1px solid ${accentColor}20`,
                }}
              >
                <span style={{ fontSize: 22, color: `${accentColor}` }}>✓</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 600,
                    fontSize: 22,
                    color: "white",
                    letterSpacing: -0.3,
                  }}
                >
                  {row.newItem}
                </span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Product Reveal (120f) ───────────────────────────────────────
const ProductRevealScene: React.FC<{
  companyName: string;
  tagline: string;
  accentColor: string;
  logoText?: string;
}> = ({ companyName, tagline, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.7 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0, 1]);

  const nameDelay = 20;
  const nameOpacity = interpolate(frame, [nameDelay, nameDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(
    spring({ frame: frame - nameDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [30, 0],
  );

  const tagDelay = 40;
  const tagOpacity = interpolate(frame, [tagDelay, tagDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const abbrev = (logoText ?? companyName.slice(0, 2)).toUpperCase();

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={22} color={`${accentColor}28`} seed={66} />
      <Noise opacity={0.02} />
      <ConfettiBurst triggerFrame={5} accentColor={accentColor} count={60} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 36,
            background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}15)`,
            border: `1.5px solid ${accentColor}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${logoScale})`,
            boxShadow: `0 0 80px ${accentColor}40, 0 24px 60px rgba(0,0,0,0.5)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 48,
              color: "white",
            }}
          >
            {abbrev}
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 80,
            letterSpacing: -4,
            color: "white",
            textAlign: "center",
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
          }}
        >
          {companyName}
        </h2>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            letterSpacing: -0.5,
            opacity: tagOpacity,
          }}
        >
          {tagline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 7: CTA (120f) ─────────────────────────────────────────────────
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
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={24} color={`${accentColor}22`} seed={99} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          transform: `scale(${entryScale})`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 86,
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
            {cta}
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
            fontSize: 28,
            padding: "20px 56px",
            boxShadow: `0 20px 60px ${accentColor}45`,
            letterSpacing: -0.5,
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
export const ComparisonVSVideo: React.FC<VideoProps> = (props) => {
  const {
    hook,
    companyName,
    tagline,
    solution,
    features,
    painPoints = [
      "Manual workflows eating your day",
      "Spreadsheets breaking at the worst time",
      "Hours lost to repetitive tasks",
      "No visibility into what's working",
    ],
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
  } = props;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene hook={hook} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        <TransitionSeries.Sequence durationInFrames={180}>
          <OldWayScene painPoints={painPoints} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        <TransitionSeries.Sequence durationInFrames={30}>
          <VSDividerScene accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        <TransitionSeries.Sequence durationInFrames={180}>
          <NewWayScene features={features} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <ComparisonGridScene
            painPoints={painPoints}
            features={features}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANS,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <ProductRevealScene
            companyName={companyName}
            tagline={tagline}
            accentColor={accentColor}
            logoText={logoText}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

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

      {(props.sfxEnabled ?? true) && (
        <>
          <SFX type="whoosh" frame={75} />
          <SFX type="impact" frame={240} />
          <SFX type="pop" frame={275} />
          <SFX type="pop" frame={303} />
          <SFX type="pop" frame={331} />
          <SFX type="whoosh" frame={420} />
          <SFX type="whoosh" frame={525} />
          <SFX type="ding" frame={635} />
        </>
      )}
      {(props.musicTrack ?? "ambient") !== "none" && (
        <BackgroundMusic
          track={(props.musicTrack as "ambient" | "upbeat" | "cinematic") ?? "ambient"}
          volume={props.musicVolume ?? 0.15}
        />
      )}
    </AbsoluteFill>
  );
};
