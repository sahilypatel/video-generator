import React, { useMemo } from "react";
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
import { VideoProps } from "./types";
import { FloatingParticles } from "./components/FloatingParticles";
import { TypewriterText } from "./components/TypewriterText";
import { ShineEffect } from "./components/ShineEffect";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { GradientText } from "./components/GradientText";
import { Noise } from "./components/Noise";
import { SFX } from "./components/SFX";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 12;

export const TEMPLATE_27_FRAMES = 450;

// ─── Scene 1: Particle Convergence (120f) ──────────────────────────────────
const ParticleConvergeScene: React.FC<{
  accentColor: string;
}> = ({ accentColor }) => {
  const frame = useCurrentFrame();

  interface ConvergeParticle {
    startX: number;
    startY: number;
    size: number;
    delay: number;
    speed: number;
  }

  function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const particles = useMemo<ConvergeParticle[]>(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = seededRandom(i * 7 + 1) * Math.PI * 2;
      const dist = 800 + seededRandom(i * 13 + 3) * 600;
      return {
        startX: 960 + Math.cos(angle) * dist,
        startY: 540 + Math.sin(angle) * dist,
        size: 2 + seededRandom(i * 17 + 5) * 4,
        delay: seededRandom(i * 23 + 7) * 40,
        speed: 0.6 + seededRandom(i * 31 + 11) * 0.4,
      };
    });
  }, []);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Noise opacity={0.015} />

      {particles.map((p, i) => {
        const progress = interpolate(
          frame - p.delay,
          [0, 100 * p.speed],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
        );
        const x = interpolate(progress, [0, 1], [p.startX, 960]);
        const y = interpolate(progress, [0, 1], [p.startY, 540]);
        const opacity = interpolate(progress, [0, 0.1, 0.8, 1], [0, 0.8, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: accentColor,
              opacity,
              boxShadow: `0 0 ${p.size * 3}px ${accentColor}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Central glow builds up */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}${Math.round(
            interpolate(frame, [60, 120], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * 255,
          ).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 2: Logo Reveal (90f) ────────────────────────────────────────────
const LogoRevealScene: React.FC<{
  logoUrl?: string | null;
  logoText?: string;
  companyName: string;
  accentColor: string;
}> = ({ logoUrl, logoText, companyName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 8, stiffness: 100, mass: 1.2 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);

  const glowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.3, 0.7]);
  const ringScale = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);

  const displayText = logoText || companyName.slice(0, 3).toUpperCase();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Noise opacity={0.015} />

      {/* Glow ring behind logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: `2px solid ${accentColor}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")}`,
          boxShadow: `0 0 80px ${accentColor}${Math.round(glowPulse * 180).toString(16).padStart(2, "0")}, inset 0 0 60px ${accentColor}20`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ transform: `scale(${logoScale})` }}>
          {logoUrl ? (
            <Img
              src={logoUrl}
              style={{
                width: 200,
                height: 200,
                objectFit: "contain",
                filter: `drop-shadow(0 0 40px ${accentColor}60)`,
              }}
            />
          ) : (
            <GradientText
              colors={["#ffffff", accentColor, "#ffffff"]}
              style={{
                fontSize: 140,
                fontWeight: 800,
                fontFamily: FONT_FAMILY,
                letterSpacing: -4,
                filter: `drop-shadow(0 0 40px ${accentColor}60)`,
              }}
            >
              {displayText}
            </GradientText>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Company Name + Tagline (90f) ─────────────────────────────────
const NameTaglineScene: React.FC<{
  companyName: string;
  tagline: string;
  accentColor: string;
  logoUrl?: string | null;
  logoText?: string;
}> = ({ companyName, tagline, accentColor, logoUrl, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const tagOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(
    spring({ frame: frame - 50, fps, config: { damping: 200 } }),
    [0, 1],
    [15, 0],
  );

  const displayText = logoText || companyName.slice(0, 3).toUpperCase();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Noise opacity={0.015} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {/* Logo */}
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 8 }}>
          {logoUrl ? (
            <Img
              src={logoUrl}
              style={{
                width: 100,
                height: 100,
                objectFit: "contain",
                filter: `drop-shadow(0 0 20px ${accentColor}40)`,
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_FAMILY,
                fontSize: 32,
                fontWeight: 800,
                color: "#000",
              }}
            >
              {displayText.slice(0, 2)}
            </div>
          )}
        </div>

        {/* Company Name via TypewriterText */}
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            margin: 0,
            letterSpacing: -3,
          }}
        >
          <TypewriterText
            text={companyName}
            delay={10}
            speed={2}
            cursorColor={accentColor}
          />
        </h1>

        {/* Tagline fades in */}
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
            textAlign: "center",
            maxWidth: 700,
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          {tagline}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Shine + Confetti (90f) ───────────────────────────────────────
const ShineConfettiScene: React.FC<{
  companyName: string;
  accentColor: string;
  logoUrl?: string | null;
  logoText?: string;
}> = ({ companyName, accentColor, logoUrl, logoText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(scaleSpring, [0, 1], [0.95, 1]);

  const displayText = logoText || companyName.slice(0, 3).toUpperCase();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Noise opacity={0.015} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
        }}
      >
        <ShineEffect delay={10} duration={40}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {logoUrl ? (
              <Img
                src={logoUrl}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                {displayText.slice(0, 2)}
              </div>
            )}
            <h1
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 80,
                fontWeight: 800,
                color: "white",
                margin: 0,
                letterSpacing: -3,
              }}
            >
              {companyName}
            </h1>
          </div>
        </ShineEffect>
      </AbsoluteFill>

      <ConfettiBurst triggerFrame={35} accentColor={accentColor} count={40} originX={50} originY={50} seed={27} />
    </AbsoluteFill>
  );
};

// ─── Scene 5: Fade to URL (60f) ────────────────────────────────────────────
const FadeToUrlScene: React.FC<{
  websiteUrl: string;
  accentColor: string;
}> = ({ websiteUrl, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const urlSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const urlOpacity = interpolate(urlSpring, [0, 1], [0, 1]);
  const urlY = interpolate(urlSpring, [0, 1], [10, 0]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Noise opacity={0.01} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 28,
            fontWeight: 600,
            color: accentColor,
            margin: 0,
            letterSpacing: 2,
            opacity: urlOpacity,
            transform: `translateY(${urlY}px)`,
          }}
        >
          {websiteUrl}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ──────────────────────────────────────────────────────
export const LogoRevealVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    tagline,
    websiteUrl,
    accentColor,
    logoUrl,
    logoText,
  } = props;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* Scene 1: Particle Convergence */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <ParticleConvergeScene accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Logo Reveal */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <LogoRevealScene logoUrl={logoUrl} logoText={logoText} companyName={companyName} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Scene 3: Company Name + Tagline */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <NameTaglineScene companyName={companyName} tagline={tagline} accentColor={accentColor} logoUrl={logoUrl} logoText={logoText} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 4: Shine + Confetti */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <ShineConfettiScene companyName={companyName} accentColor={accentColor} logoUrl={logoUrl} logoText={logoText} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 5: Fade to URL */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <FadeToUrlScene websiteUrl={websiteUrl} accentColor={accentColor} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {(props.sfxEnabled ?? true) && (
        <>
          <SFX type="rise" frame={0} />
          <SFX type="impact" frame={108} />
          <SFX type="ding" frame={186} />
        </>
      )}
      {(props.musicTrack ?? "cinematic") !== "none" && (
        <BackgroundMusic
          track={(props.musicTrack as "ambient" | "upbeat" | "cinematic") ?? "cinematic"}
          volume={props.musicVolume ?? 0.15}
        />
      )}
    </AbsoluteFill>
  );
};
