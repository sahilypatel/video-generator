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
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { CursorPointer } from "./components/CursorPointer";
import { LogoWatermark } from "./components/LogoWatermark";
import { FONT_FAMILY } from "./fonts";

// Frame budget (30 fps):
// Scene 1 Hook:     90f  (3s)     trans:15f
// Scene 2 Problem:  120f (4s)     trans:15f
// Scene 3 Reveal:   150f (5s)     trans:15f
// Scene 4 Features: 3×105f with 2×12f internal transitions  → net 315-24=291
//   (outer trans: 15f into scene5)
// Scene 5 Social:   90f  (3s)     trans:15f
// Scene 6 CTA:      90f  (3s)
// Sequences sum: 90+120+150+105+105+105+90+90 = 855
// Transitions sum: 15+15+15+12+12+15+15 = 99
// Net: 855 - 99 = 756 frames ≈ 25.2s
export const TEMPLATE_21_FRAMES = 756;

const TRANS = 15;

// ─── Shared pure-dark background (#0B0B0F) ─────────────────────────────────
const DarkBase: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.85, 1.15]);

  return (
    <AbsoluteFill style={{ background: "#0B0B0F", overflow: "hidden" }}>
      {/* Primary ambient orb */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}1e 0%, transparent 70%)`,
          left: "20%",
          top: "15%",
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(90px)",
        }}
      />
      {/* Secondary ambient orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
          right: "-5%",
          bottom: "-5%",
          filter: "blur(110px)",
        }}
      />
      {/* Dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 1: Kinetic Hook (90f = 3s) ────────────────────────────────────
const KineticHookScene: React.FC<{
  hook: string;
  accentColor: string;
  companyName: string;
}> = ({ hook, accentColor, companyName }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });
  const containerScale = interpolate(containerSpring, [0, 1], [0.88, 1]);

  // White flash pattern interrupt
  const flash = interpolate(frame, [0, 2, 8], [1, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line sweeps in
  const lineWidth = interpolate(
    spring({ frame: frame - 5, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 260],
  );

  // Company eyebrow badge
  const eyebrowOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eyebrowY = interpolate(
    spring({ frame: frame - 25, fps, config: { damping: 200 } }),
    [0, 1],
    [16, 0],
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={25} color="rgba(255,255,255,0.1)" seed={42} />
      <Noise opacity={0.03} />

      {/* Pattern-interrupt flash */}
      <AbsoluteFill
        style={{ background: "white", opacity: flash, pointerEvents: "none" }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 120px",
          transform: `scale(${containerScale})`,
        }}
      >
        {/* Kinetic accent line */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            borderRadius: 2,
          }}
        />

        {/* Main hook — word-by-word SLAM + scale/blur reveal */}
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 100,
            lineHeight: 1.0,
            letterSpacing: -5,
            color: "white",
            textAlign: "center",
            maxWidth: 1340,
          }}
        >
          <AnimatedText
            split="word"
            animation="slam"
            staggerFrames={5}
            delay={3}
            blurAmount={6}
          >
            {hook}
          </AnimatedText>
        </h1>

        {/* Company eyebrow */}
        <div
          style={{
            opacity: eyebrowOpacity,
            transform: `translateY(${eyebrowY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            {companyName}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Problem Visualization (120f = 4s) ───────────────────────────
const ProblemVisualizationScene: React.FC<{
  painPoints: string[];
  accentColor: string;
}> = ({ painPoints, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const p1 = painPoints[0] ?? "Manual workflows eating your day";
  const p2 = painPoints[1] ?? "No visibility into what's working";

  // Card 1 slides from left
  const card1Spring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1 },
  });
  const card1X = interpolate(card1Spring, [0, 1], [-520, 0]);
  const card1Opacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card 2 slides from right
  const card2Spring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1 },
  });
  const card2X = interpolate(card2Spring, [0, 1], [520, 0]);
  const card2Opacity = interpolate(frame, [38, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Urgency shake for each card
  const shake1 = Math.sin(frame * 1.2) * Math.max(0, 1 - (frame - 8) / 28) * 5;
  const shake2 =
    Math.sin(frame * 1.1 + 1) * Math.max(0, 1 - (frame - 38) / 28) * 5;

  // Red pulse glow on cards
  const redGlowOpacity = interpolate(
    Math.sin(frame * 0.18),
    [-1, 1],
    [0.06, 0.15],
  );

  const labelOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const cardStyle = (
    tx: number,
    opacity: number,
    shakeY: number,
  ): React.CSSProperties => ({
    opacity,
    transform: `translateX(${tx}px) translateY(${shakeY}px)`,
    borderRadius: 20,
    border: "1.5px solid rgba(255,70,70,0.4)",
    background: "rgba(255,40,40,0.06)",
    padding: "28px 44px",
    maxWidth: 760,
    width: "100%",
    boxShadow: `0 0 40px rgba(255,60,60,${redGlowOpacity.toFixed(2)}), inset 0 0 20px rgba(255,40,40,0.02)`,
    display: "flex",
    alignItems: "center",
    gap: 20,
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkBase accentColor="#FF3333" />
      <Noise opacity={0.025} />

      {/* Red overlay tint */}
      <AbsoluteFill
        style={{
          background: `rgba(255,40,40,${(redGlowOpacity * 0.4).toFixed(2)})`,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />

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
        {/* Section eyebrow */}
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "rgba(255,100,100,0.75)",
            opacity: labelOpacity,
          }}
        >
          Sound familiar?
        </span>

        {/* Problem card 1 — slides from left */}
        <div style={cardStyle(card1X, card1Opacity, shake1)}>
          <div
            style={{
              flex: "0 0 auto",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,60,60,0.15)",
              border: "1px solid rgba(255,60,60,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ⚠️
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: -1,
              lineHeight: 1.2,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {p1}
          </p>
        </div>

        {/* Problem card 2 — slides from right */}
        <div style={cardStyle(card2X, card2Opacity, shake2)}>
          <div
            style={{
              flex: "0 0 auto",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,60,60,0.15)",
              border: "1px solid rgba(255,60,60,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ⚠️
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: -1,
              lineHeight: 1.2,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {p2}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Product Reveal (150f = 5s) ─────────────────────────────────
const ProductRevealScene: React.FC<{
  companyName: string;
  solution: string;
  accentColor: string;
  logoText?: string;
}> = ({ companyName, solution, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cinematic zoom-in
  const zoomSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1.2 },
  });
  const sceneScale = interpolate(zoomSpring, [0, 1], [1.08, 1]);

  // Logo badge springs in
  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.7 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoOpacity = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow rings from logo
  const ring1Phase = (frame % 50) / 50;
  const ring2Phase = ((frame + 18) % 50) / 50;
  const ring1Scale = interpolate(ring1Phase, [0, 1], [1, 2.6]);
  const ring1Opacity = interpolate(ring1Phase, [0, 0.25, 1], [0.45, 0.2, 0]);
  const ring2Scale = interpolate(ring2Phase, [0, 1], [1, 2.6]);
  const ring2Opacity = interpolate(ring2Phase, [0, 0.25, 1], [0.32, 0.15, 0]);

  // Light leak diagonal sweep
  const leakProgress = interpolate(frame, [12, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leakX = interpolate(leakProgress, [0, 1], [-250, 2200]);
  const leakOpacity = interpolate(
    leakProgress,
    [0, 0.08, 0.92, 1],
    [0, 0.22, 0.22, 0],
  );

  // Headline: "{companyName} solves this."
  const headlineDelay = 55;
  const headlineOpacity = interpolate(
    frame,
    [headlineDelay, headlineDelay + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const headlineY = interpolate(
    spring({
      frame: frame - headlineDelay,
      fps,
      config: { damping: 200 },
    }),
    [0, 1],
    [32, 0],
  );

  const solutionDelay = headlineDelay + 30;
  const solutionOpacity = interpolate(
    frame,
    [solutionDelay, solutionDelay + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const abbrev = (logoText ?? companyName.slice(0, 2)).toUpperCase();

  return (
    <AbsoluteFill
      style={{ opacity: 1 - exit, transform: `scale(${sceneScale})` }}
    >
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={20} color={`${accentColor}28`} seed={13} />
      <Noise opacity={0.02} />

      {/* Light leak sweep */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 200,
          left: leakX,
          background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
          transform: "skewX(-12deg)",
          pointerEvents: "none",
          opacity: leakOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* Logo badge with pulsing glow rings */}
        <div
          style={{
            position: "relative",
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          {/* Glow ring 1 */}
          <div
            style={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${ring1Scale})`,
              opacity: ring1Opacity,
              pointerEvents: "none",
            }}
          />
          {/* Glow ring 2 */}
          <div
            style={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${ring2Scale})`,
              opacity: ring2Opacity,
              pointerEvents: "none",
            }}
          />
          {/* Logo badge */}
          <div
            style={{
              width: 124,
              height: 124,
              borderRadius: 36,
              background: `linear-gradient(135deg, ${accentColor}45, ${accentColor}18)`,
              border: `1.5px solid ${accentColor}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 70px ${accentColor}45, 0 24px 60px rgba(0,0,0,0.5)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 50,
                color: "white",
                letterSpacing: -1,
              }}
            >
              {abbrev}
            </span>
          </div>
        </div>

        {/* "{companyName} solves this." */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 78,
              letterSpacing: -3.5,
              lineHeight: 1.05,
              color: "white",
            }}
          >
            <AnimatedText
              split="word"
              animation="slam"
              staggerFrames={5}
              delay={headlineDelay + 2}
            >
              {`${companyName} solves this.`}
            </AnimatedText>
          </h2>
        </div>

        {/* Solution sub-text */}
        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 400,
            fontSize: 24,
            color: "rgba(255,255,255,0.52)",
            letterSpacing: -0.5,
            lineHeight: 1.4,
            maxWidth: 680,
            textAlign: "center",
            opacity: solutionOpacity,
          }}
        >
          {solution}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Feature Demo (105f each = 3.5s) ────────────────────────────
const FeatureDemoScene: React.FC<{
  index: number;
  total: number;
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}> = ({ index, total, icon, title, description, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Feature panel slides in from right
  const panelSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.8 },
  });
  const panelX = interpolate(panelSpring, [0, 1], [160, 0]);
  const panelOpacity = interpolate(panelSpring, [0, 1], [0, 1]);

  // Icon pops in
  const iconSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1]);

  // Animated checkmark ring stroke
  const checkDelay = 50;
  const checkProgress = interpolate(frame, [checkDelay, checkDelay + 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const strokeDash = 50;
  const strokeOffset = interpolate(checkProgress, [0, 1], [strokeDash, 0]);

  // Description fade
  const descDelay = 30;
  const descOpacity = interpolate(frame, [descDelay, descDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent divider grows
  const dividerWidth = interpolate(frame, [40, 80], [0, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Active sidebar highlight pulse
  const highlightPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.10, 0.20],
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      {/* Progress pills at top */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 36 : 10,
              height: 10,
              borderRadius: 99,
              background:
                i <= index ? accentColor : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 100px 60px",
          gap: 64,
        }}
      >
        {/* Left: Mini app UI mockup with sidebar */}
        <div
          style={{
            flex: "0 0 300px",
            height: 480,
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.025)",
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* macOS-style title bar */}
          <div
            style={{
              height: 46,
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "rgba(255,100,100,0.55)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "rgba(255,200,0,0.45)",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "rgba(100,255,100,0.35)",
              }}
            />
          </div>

          {/* Sidebar feature list */}
          <div
            style={{
              padding: "14px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {Array.from({ length: total }).map((_, i) => {
              const active = i === index;
              const itemDelay = i * 8;
              const itemOpacity = interpolate(
                frame,
                [itemDelay, itemDelay + 14],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              const hlHex = Math.round(highlightPulse * 255)
                .toString(16)
                .padStart(2, "0");
              return (
                <div
                  key={i}
                  style={{
                    padding: "13px 14px",
                    borderRadius: 11,
                    background: active
                      ? `${accentColor}${hlHex}`
                      : "transparent",
                    border: active
                      ? `1px solid ${accentColor}42`
                      : "1px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    opacity: itemOpacity,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: active
                        ? accentColor
                        : "rgba(255,255,255,0.2)",
                      boxShadow: active ? `0 0 8px ${accentColor}` : "none",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? "white" : "rgba(255,255,255,0.38)",
                    }}
                  >
                    Feature {i + 1}
                  </span>
                </div>
              );
            })}

            {/* Decorative metric bars */}
            <div style={{ marginTop: 18, padding: "0 6px" }}>
              {[0.78, 0.52, 0.64].map((w, i) => {
                const barOpacity = interpolate(
                  frame,
                  [22 + i * 10, 36 + i * 10],
                  [0, 0.38],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                const barW = interpolate(
                  frame,
                  [22 + i * 10, 56 + i * 10],
                  [0, w * 195],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  },
                );
                return (
                  <div key={i} style={{ marginBottom: 9, opacity: barOpacity }}>
                    <div
                      style={{
                        height: 4,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: barW,
                          borderRadius: 2,
                          background: `${accentColor}60`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Feature detail */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            opacity: panelOpacity,
            transform: `translateX(${panelX}px)`,
          }}
        >
          {/* Icon with animated ring */}
          <div style={{ position: "relative", width: 104, height: 104 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 26,
                background: `linear-gradient(135deg, ${accentColor}28, ${accentColor}0e)`,
                border: `1.5px solid ${accentColor}38`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                transform: `scale(${iconScale})`,
                boxShadow: `0 8px 32px ${accentColor}22`,
              }}
            >
              {icon}
            </div>
            <svg
              width="104"
              height="104"
              viewBox="0 0 104 104"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <circle
                cx="52"
                cy="52"
                r="49"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                opacity={0.6}
              />
            </svg>
          </div>

          {/* Feature title */}
          <h3
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 70,
              letterSpacing: -3,
              lineHeight: 1.04,
              color: "white",
            }}
          >
            <AnimatedText
              split="word"
              animation="slam"
              staggerFrames={5}
              delay={14}
            >
              {title}
            </AnimatedText>
          </h3>

          {/* Feature description */}
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              fontSize: 26,
              color: "rgba(255,255,255,0.52)",
              letterSpacing: -0.5,
              lineHeight: 1.45,
              maxWidth: 560,
              opacity: descOpacity,
            }}
          >
            {description}
          </p>

          {/* Accent divider */}
          <div
            style={{
              width: dividerWidth,
              height: 3,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}45, transparent)`,
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Cursor clicks on the active sidebar item */}
      <CursorPointer
        startX={1550}
        startY={780}
        endX={232}
        endY={192 + index * 46}
        delay={18}
        clickAtFrame={44}
        accentColor={accentColor}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 5: Social Proof / Credibility (90f = 3s) ──────────────────────
const SocialProofScene: React.FC<{
  stats: Array<{ label: string; value: string }>;
  accentColor: string;
}> = ({ stats, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const s0 = stats[0] ?? { label: "Users", value: "10,000+" };
  const s1 = stats[1] ?? { label: "Uptime", value: "99.9%" };

  const extractNum = (v: string) =>
    parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;
  const num0 = extractNum(s0.value);
  const suffix0 = s0.value.replace(/[0-9,]/g, "").trim();
  const num1 = extractNum(s1.value);
  const suffix1 = s1.value.replace(/[0-9,]/g, "").trim();

  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const containerScale = interpolate(containerSpring, [0, 1], [0.88, 1]);

  // Counter 0 animates up
  const count0 = Math.round(
    interpolate(frame, [5, 62], [0, num0 > 0 ? num0 : 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  // Counter 1 animates up (offset)
  const count1 = Math.round(
    interpolate(frame, [22, 68], [0, num1 > 0 ? num1 : 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  const numScale0 = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 80 } }),
    [0, 1],
    [0.7, 1],
  );
  const numScale1 = interpolate(
    spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 80 } }),
    [0, 1],
    [0.7, 1],
  );

  const label0Opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const label1Opacity = interpolate(frame, [32, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerH = interpolate(frame, [10, 38], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const eyebrowOpacity = interpolate(frame, [0, 14], [0, 1], {
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
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={18} color={`${accentColor}2e`} seed={77} />
      <Noise opacity={0.02} />
      <ConfettiBurst triggerFrame={5} accentColor={accentColor} count={50} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          transform: `scale(${containerScale})`,
        }}
      >
        {/* Eyebrow label */}
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: `${accentColor}cc`,
            opacity: eyebrowOpacity,
          }}
        >
          By the numbers
        </span>

        {/* Two stat counters side by side */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 60 }}
        >
          {/* Stat 0 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ transform: `scale(${numScale0})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 120,
                  letterSpacing: -6,
                  lineHeight: 1,
                  color: "white",
                  display: "block",
                }}
              >
                {num0 > 0 ? count0.toLocaleString() : s0.value}
                {num0 > 0 ? suffix0 : ""}
              </span>
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                fontSize: 17,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: accentColor,
                opacity: label0Opacity,
              }}
            >
              {s0.label}
            </span>
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: 2,
              height: dividerH,
              background: `linear-gradient(to bottom, transparent, ${accentColor}60, transparent)`,
              borderRadius: 1,
            }}
          />

          {/* Stat 1 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ transform: `scale(${numScale1})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 900,
                  fontSize: 120,
                  letterSpacing: -6,
                  lineHeight: 1,
                  color: "white",
                  display: "block",
                }}
              >
                {num1 > 0 ? count1.toLocaleString() : s1.value}
                {num1 > 0 ? suffix1 : ""}
              </span>
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                fontSize: 17,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: accentColor,
                opacity: label1Opacity,
              }}
            >
              {s1.label}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA Outro (90f = 3s) ───────────────────────────────────────
const CTAOutroScene: React.FC<{
  cta: string;
  websiteUrl: string;
  companyName: string;
  accentColor: string;
  logoText?: string;
}> = ({ cta, websiteUrl, companyName, accentColor, logoText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const entryScale = interpolate(entrySpring, [0, 1], [0.9, 1]);

  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [1, 1.04]);
  const haloPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0, 0.28]);

  const urlDelay = 40;
  const urlOpacity = interpolate(frame, [urlDelay, urlDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cinematic fade-to-black at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );

  const abbrev = (logoText ?? companyName.slice(0, 2)).toUpperCase();

  return (
    <AbsoluteFill style={{ opacity: 1 - fadeOut }}>
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={28} color={`${accentColor}22`} seed={99} />
      <Noise opacity={0.025} />
      <ConfettiBurst triggerFrame={3} accentColor={accentColor} count={35} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          transform: `scale(${entryScale})`,
          padding: "0 120px",
        }}
      >
        {/* CTA headline */}
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 90,
            letterSpacing: -4.5,
            lineHeight: 1.04,
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

        {/* Pulsing gradient CTA button */}
        <div style={{ position: "relative" }}>
          {/* Halo ring */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: 24,
              border: `2px solid ${accentColor}`,
              transform: `scale(${pulse * 1.14})`,
              opacity: haloPulse,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              transform: `scale(${pulse})`,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}b0)`,
              color: "white",
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 30,
              padding: "20px 58px",
              boxShadow: `0 20px 60px ${accentColor}48`,
              letterSpacing: -0.5,
            }}
          >
            {cta}
          </div>
        </div>

        {/* Logo badge + website URL */}
        <div
          style={{
            opacity: urlOpacity,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: `linear-gradient(135deg, ${accentColor}38, ${accentColor}14)`,
              border: `1px solid ${accentColor}42`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 13,
                color: "white",
              }}
            >
              {abbrev}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 20,
              color: `${accentColor}cc`,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {websiteUrl}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────
export const SaaSPromoVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    hook,
    solution,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
    painPoints = [
      "Manual workflows eating your day",
      "No visibility into what's working",
    ],
    stats = [
      { label: "Users", value: "10,000+" },
      { label: "Uptime", value: "99.9%" },
    ],
  } = props;

  const featureList = features.slice(0, 3);

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Kinetic Hook — 3s */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <KineticHookScene
            hook={hook}
            accentColor={accentColor}
            companyName={companyName}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANS,
          })}
        />

        {/* Scene 2: Problem Visualization — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <ProblemVisualizationScene
            painPoints={painPoints}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 3: Product Reveal — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <ProductRevealScene
            companyName={companyName}
            solution={solution}
            accentColor={accentColor}
            logoText={logoText}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANS,
          })}
        />

        {/* Scene 4: Feature Demo — 3 × 3.5s with fast slide transitions */}
        {featureList.map((feature, index) => (
          <React.Fragment key={`saas-feat-${index}`}>
            <TransitionSeries.Sequence durationInFrames={105}>
              <FeatureDemoScene
                index={index}
                total={featureList.length}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>
            {index < featureList.length - 1 && (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: 12 })}
              />
            )}
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 5: Social Proof — 3s */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <SocialProofScene stats={stats} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 6: CTA Outro — 3s */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <CTAOutroScene
            cta={cta}
            websiteUrl={websiteUrl}
            companyName={companyName}
            accentColor={accentColor}
            logoText={logoText}
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
