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
import { BrowserMockup } from "./components/BrowserMockup";
import { CursorPointer } from "./components/CursorPointer";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { SFX } from "./components/SFX";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

export const TEMPLATE_29_FRAMES = 900;

const DARK_BG = "#0a0a14";
const SURFACE = "#151522";
const BORDER = "#252538";
const MUTED = "#9896a8";

// ─── Shared Dashboard Mockup Content ───────────────────────────────────────
const DashboardContent: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0d0d1a",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          background: SURFACE,
          borderRight: `1px solid ${BORDER}`,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
            marginBottom: 16,
          }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 32,
              borderRadius: 8,
              background: i === 0 ? `${accentColor}18` : "transparent",
              border: i === 0 ? `1px solid ${accentColor}30` : "1px solid transparent",
              opacity: interpolate(frame, [8 + i * 4, 18 + i * 4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top stats row */}
        <div style={{ display: "flex", gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 72,
                borderRadius: 12,
                background: i === 0
                  ? `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`
                  : SURFACE,
                border: `1px solid ${i === 0 ? `${accentColor}30` : BORDER}`,
                opacity: interpolate(frame, [12 + i * 5, 24 + i * 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          ))}
        </div>

        {/* Chart area */}
        <div
          style={{
            flex: 1,
            borderRadius: 12,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            position: "relative",
            overflow: "hidden",
            opacity: interpolate(frame, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.4 }}
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 180 L60 150 L120 160 L180 120 L240 90 L300 100 L360 60 L420 40 L480 55 L540 30 L600 20 L600 200 L0 200 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M0 180 L60 150 L120 160 L180 120 L240 90 L300 100 L360 60 L420 40 L480 55 L540 30 L600 20"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Bottom cards */}
        <div style={{ display: "flex", gap: 12 }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 56,
                borderRadius: 10,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                opacity: interpolate(frame, [28 + i * 6, 40 + i * 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Scene 1: Hook (90f) ───────────────────────────────────────────────────
const HookScene: React.FC<{
  hook: string;
  companyName: string;
  accentColor: string;
  logoText?: string;
}> = ({ hook, companyName, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeUp = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const textY = interpolate(fadeUp, [0, 1], [50, 0]);
  const textOpacity = interpolate(fadeUp, [0, 1], [0, 1]);

  const badge = logoText || companyName.slice(0, 2).toUpperCase();
  const badgeOpacity = interpolate(frame, [22, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeSpring = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 140 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={18} color="rgba(255,255,255,0.12)" seed={29} />
      <Noise opacity={0.025} />

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
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}40`,
            borderRadius: 12,
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_FAMILY,
              fontSize: 11,
              fontWeight: 800,
              color: "#000",
            }}
          >
            {badge.slice(0, 2)}
          </div>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {companyName}
          </span>
        </div>

        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              letterSpacing: -3,
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            <AnimatedText split="word" staggerFrames={4} durationPerUnit={18} delay={5} yOffset={30} blurAmount={5}>
              {hook || `Let me show you ${companyName}`}
            </AnimatedText>
          </h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Browser Mockup Appear (150f) ─────────────────────────────────
const BrowserAppearScene: React.FC<{
  websiteUrl: string;
  accentColor: string;
}> = ({ websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 1.2 },
  });
  const slideY = interpolate(entrySpring, [0, 1], [120, 0]);
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 120px",
        }}
      >
        <div
          style={{
            width: 1200,
            opacity: entryOpacity,
            transform: `translateY(${slideY}px)`,
          }}
        >
          <BrowserMockup url={`https://${websiteUrl}`} accentColor={accentColor}>
            <div style={{ height: 540 }}>
              <DashboardContent accentColor={accentColor} />
            </div>
          </BrowserMockup>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Feature Walkthrough Scene (120f each) ─────────────────────────────────
const FeatureWalkthroughScene: React.FC<{
  websiteUrl: string;
  featureTitle: string;
  featureDescription: string;
  featureIndex: number;
  accentColor: string;
}> = ({ websiteUrl, featureTitle, featureDescription, featureIndex, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursorTargets = [
    { x: 460, y: 220 },
    { x: 780, y: 320 },
    { x: 620, y: 440 },
  ];

  const target = cursorTargets[featureIndex % cursorTargets.length];
  const startX = featureIndex === 0 ? 300 : cursorTargets[(featureIndex - 1) % cursorTargets.length].x;
  const startY = featureIndex === 0 ? 350 : cursorTargets[(featureIndex - 1) % cursorTargets.length].y;

  const tooltipDelay = 40;
  const tooltipSpring = spring({
    frame: frame - tooltipDelay,
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const tooltipScale = interpolate(tooltipSpring, [0, 1], [0.7, 1]);
  const tooltipOpacity = interpolate(tooltipSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="feature" />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 120px",
        }}
      >
        <div style={{ width: 1200, position: "relative" }}>
          <BrowserMockup url={`https://${websiteUrl}`} accentColor={accentColor}>
            <div style={{ height: 540, position: "relative" }}>
              <DashboardContent accentColor={accentColor} />

              {/* Highlight pulse at target area */}
              <div
                style={{
                  position: "absolute",
                  left: target.x - 120,
                  top: target.y - 120,
                  width: 100,
                  height: 100,
                  borderRadius: 16,
                  border: `2px solid ${accentColor}60`,
                  boxShadow: `0 0 30px ${accentColor}30`,
                  opacity: interpolate(frame, [30, 45], [0, 0.8], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </div>
          </BrowserMockup>

          <CursorPointer
            startX={startX}
            startY={startY}
            endX={target.x}
            endY={target.y}
            delay={5}
            clickAtFrame={35}
            accentColor={accentColor}
          />

          {/* Tooltip overlay */}
          <div
            style={{
              position: "absolute",
              left: target.x + 30,
              top: target.y - 60,
              opacity: tooltipOpacity,
              transform: `scale(${tooltipScale})`,
              transformOrigin: "left top",
              background: SURFACE,
              border: `1px solid ${accentColor}40`,
              borderRadius: 14,
              padding: "18px 24px",
              maxWidth: 280,
              boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${accentColor}15`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: accentColor,
                }}
              />
              <h4
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "white",
                  margin: 0,
                }}
              >
                {featureTitle}
              </h4>
            </div>
            <p
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 13,
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {featureDescription}
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Full View + Feature Badges (120f) ────────────────────────────
const FullViewBadgesScene: React.FC<{
  websiteUrl: string;
  steps: Array<{ title: string; description: string }>;
  accentColor: string;
}> = ({ websiteUrl, steps, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="solution" />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "40px 120px",
          opacity: entryOpacity,
        }}
      >
        <div style={{ width: 1000 }}>
          <BrowserMockup url={`https://${websiteUrl}`} accentColor={accentColor}>
            <div style={{ height: 420 }}>
              <DashboardContent accentColor={accentColor} />
            </div>
          </BrowserMockup>
        </div>

        {/* Feature checkmark badges */}
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {steps.slice(0, 3).map((step, i) => {
            const badgeDelay = 20 + i * 14;
            const badgeSpring = spring({
              frame: frame - badgeDelay,
              fps,
              config: { damping: 10, stiffness: 140 },
            });
            const badgeScale = interpolate(badgeSpring, [0, 1], [0.4, 1]);
            const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  opacity: badgeOpacity,
                  transform: `scale(${badgeScale})`,
                  background: SURFACE,
                  border: `1px solid ${accentColor}30`,
                  borderRadius: 12,
                  padding: "12px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="9" fill={accentColor} />
                  <polyline
                    points="6,10 9,13 14,7"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 7: CTA (180f) ──────────────────────────────────────────────────
const CTAScene: React.FC<{
  cta: string;
  websiteUrl: string;
  accentColor: string;
}> = ({ cta, websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1]);

  const buttonSpring = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 120 } });
  const buttonScale = interpolate(buttonSpring, [0, 1], [0.5, 1]);
  const buttonOpacity = interpolate(buttonSpring, [0, 1], [0, 1]);

  const urlOpacity = interpolate(frame, [45, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.03]);

  return (
    <AbsoluteFill style={{ background: DARK_BG }}>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <FloatingParticles count={24} color={`${accentColor}28`} seed={129} />
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
            fontSize: 68,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            letterSpacing: -3,
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          <AnimatedText split="word" staggerFrames={4} durationPerUnit={20} delay={5} yOffset={35} blurAmount={5}>
            {cta || "Try it yourself"}
          </AnimatedText>
        </h2>

        <div style={{ opacity: buttonOpacity, transform: `scale(${buttonScale * pulse})` }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              borderRadius: 18,
              padding: "18px 48px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 16px 50px ${accentColor}44`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 700,
                color: "#000",
              }}
            >
              Try it yourself
            </span>
            <span style={{ fontSize: 18, color: "#000" }}>→</span>
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
export const AppWalkthroughVideo: React.FC<VideoProps> = (props) => {
  const {
    hook,
    companyName,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
    features = [],
    demoSteps = [],
  } = props;

  const steps = demoSteps.length > 0
    ? demoSteps
    : features.slice(0, 3).map((f) => ({ title: f.title, description: f.description }));

  const safeSteps = steps.length > 0
    ? steps
    : [
        { title: "Dashboard", description: "See all your data at a glance" },
        { title: "Analytics", description: "Track performance in real-time" },
        { title: "Settings", description: "Customize everything to your needs" },
      ];

  const walkthroughSteps = safeSteps.slice(0, 3);

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

        {/* Scene 2: Browser Mockup Appear */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <BrowserAppearScene websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scenes 3-5: Feature Walkthroughs */}
        {walkthroughSteps.map((step, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={120}>
              <FeatureWalkthroughScene
                websiteUrl={websiteUrl}
                featureTitle={step.title}
                featureDescription={step.description}
                featureIndex={i}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
          </React.Fragment>
        ))}

        {/* Scene 6: Full View + Badges */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <FullViewBadgesScene websiteUrl={websiteUrl} steps={walkthroughSteps} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 7: CTA */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <CTAScene cta={cta} websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <LogoWatermark logoUrl={logoUrl} companyName={companyName} accentColor={accentColor} />

      {(props.sfxEnabled ?? true) && (
        <>
          <SFX type="whoosh" frame={75} />
          <SFX type="click" frame={245} />
          <SFX type="pop" frame={250} />
          <SFX type="click" frame={350} />
          <SFX type="pop" frame={355} />
          <SFX type="click" frame={455} />
          <SFX type="pop" frame={460} />
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
