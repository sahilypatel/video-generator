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
import { VideoProps } from "./types";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { SFX } from "./components/SFX";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { FONT_FAMILY } from "./fonts";

// Frame budget (30 fps):
// Scene 1 Hook:          90f   trans:15f
// Scene 2 Testimonials: 540f (3×180f with 2×15f slide transitions inside)
//   Card A: 180f  trans:15f  Card B: 180f  trans:15f  Card C: 180f
//   Net: 540 - 30 = 510     trans:15f into scene 3
// Scene 3 Logo Wall:    120f   trans:15f
// Scene 4 CTA:          150f
// Sum: 90+180+180+180+120+150 = 900
// Trans: 15+15+15+15+15 = 75
// Net: 900 - 75 = 825 frames ≈ 27.5s
export const TEMPLATE_23_FRAMES = 825;

const TRANS = 15;

const DarkBase: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame * 0.025), [-1, 1], [0.9, 1.1]);

  return (
    <AbsoluteFill style={{ background: "#08080F", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}14 0%, transparent 70%)`,
          left: "65%",
          top: "25%",
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}0c 0%, transparent 70%)`,
          left: "15%",
          bottom: "10%",
          filter: "blur(80px)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 1: Hook with Big Stat (90f) ────────────────────────────────────
const HookStatScene: React.FC<{
  hook: string;
  proofMetric?: string;
  companyName: string;
  accentColor: string;
}> = ({ hook, proofMetric, companyName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const metricSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.8 },
  });
  const metricScale = interpolate(metricSpring, [0, 1], [0.5, 1]);
  const metricOpacity = interpolate(metricSpring, [0, 0.4], [0, 1]);

  const hookDelay = 18;
  const hookOpacity = interpolate(frame, [hookDelay, hookDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookY = interpolate(
    spring({ frame: frame - hookDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [25, 0],
  );

  const badgeDelay = 40;
  const badgeOpacity = interpolate(
    frame,
    [badgeDelay, badgeDelay + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={18} color="rgba(255,255,255,0.06)" seed={23} />
      <Noise opacity={0.03} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 120px",
        }}
      >
        {proofMetric && (
          <div
            style={{
              opacity: metricOpacity,
              transform: `scale(${metricScale})`,
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 130,
              letterSpacing: -6,
              color: accentColor,
              lineHeight: 1,
              textShadow: `0 0 80px ${accentColor}50`,
            }}
          >
            {proofMetric}
          </div>
        )}

        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 56,
            letterSpacing: -2,
            color: "white",
            textAlign: "center",
            opacity: hookOpacity,
            transform: `translateY(${hookY}px)`,
          }}
        >
          {hook}
        </h1>

        <div
          style={{
            opacity: badgeOpacity,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: `${accentColor}bb`,
            }}
          >
            {companyName}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Single Testimonial Card (180f each) ──────────────────────────────────
const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  accentColor: string;
  index: number;
  total: number;
}> = ({ quote, author, role, accentColor, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const flipSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1.2 },
  });
  const rotateY = interpolate(flipSpring, [0, 1], [90, 0]);
  const cardOpacity = interpolate(rotateY, [90, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const quoteDelay = 20;
  const quoteOpacity = interpolate(
    frame,
    [quoteDelay, quoteDelay + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const authorDelay = 50;
  const authorOpacity = interpolate(
    frame,
    [authorDelay, authorDelay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const authorY = interpolate(
    spring({ frame: frame - authorDelay, fps, config: { damping: 200 } }),
    [0, 1],
    [15, 0],
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <DarkBase accentColor={accentColor} />
      <Noise opacity={0.025} />

      {/* Progress dots */}
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
              width: i === index ? 32 : 10,
              height: 10,
              borderRadius: 99,
              background:
                i <= index ? accentColor : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 140px",
        }}
      >
        <div
          style={{
            opacity: cardOpacity,
            transform: `perspective(1200px) rotateY(${rotateY}deg)`,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 28,
            padding: "56px 64px",
            maxWidth: 900,
            width: "100%",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Star rating */}
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: 5 }).map((_, si) => {
              const starDelay = 10 + si * 4;
              const starSpring = spring({
                frame: frame - starDelay,
                fps,
                config: { damping: 10, stiffness: 180 },
              });
              const starScale = interpolate(starSpring, [0, 1], [0, 1]);

              return (
                <span
                  key={si}
                  style={{
                    fontSize: 28,
                    color: "#FFD700",
                    transform: `scale(${starScale})`,
                    display: "inline-block",
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>

          {/* Quote */}
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontWeight: 500,
              fontSize: 38,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.4,
              letterSpacing: -0.5,
              opacity: quoteOpacity,
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>

          {/* Author */}
          <div
            style={{
              opacity: authorOpacity,
              transform: `translateY(${authorY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}18)`,
                border: `1px solid ${accentColor}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_FAMILY,
                fontWeight: 700,
                fontSize: 18,
                color: "white",
              }}
            >
              {author.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 20,
                  color: "white",
                }}
              >
                {author}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 15,
                  color: accentColor,
                }}
              >
                {role}
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Logo Wall (120f) ────────────────────────────────────────────
const LogoWallScene: React.FC<{
  proofLogos: string[];
  accentColor: string;
}> = ({ proofLogos, accentColor }) => {
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
      <DarkBase accentColor={accentColor} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 120px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: `${accentColor}aa`,
            opacity: titleOpacity,
          }}
        >
          Trusted by industry leaders
        </span>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {proofLogos.slice(0, 5).map((logo, i) => {
            const delay = 10 + i * 10;
            const logoSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 120 },
            });
            const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
            const logoOpacity = interpolate(
              frame,
              [delay, delay + 12],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={logo}
                style={{
                  opacity: logoOpacity,
                  transform: `scale(${logoScale})`,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 16,
                  padding: "18px 36px",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 22,
                  color: "rgba(255,255,255,0.65)",
                  letterSpacing: -0.3,
                }}
              >
                {logo}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (150f) ─────────────────────────────────────────────────
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

  const pulse = interpolate(Math.sin(frame * 0.09), [-1, 1], [1, 1.04]);

  const urlDelay = 45;
  const urlOpacity = interpolate(frame, [urlDelay, urlDelay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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

  return (
    <AbsoluteFill style={{ opacity: 1 - fadeOut }}>
      <DarkBase accentColor={accentColor} />
      <FloatingParticles count={22} color={`${accentColor}20`} seed={88} />
      <Noise opacity={0.025} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          transform: `scale(${entryScale})`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 82,
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
            fontSize: 26,
            padding: "20px 54px",
            boxShadow: `0 20px 60px ${accentColor}45`,
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
export const TestimonialCarouselVideo: React.FC<VideoProps> = (props) => {
  const {
    hook,
    companyName,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    proofMetric = "500+",
    proofLogos = ["Notion", "Vercel", "Stripe", "Linear", "Figma"],
    testimonials = [
      {
        quote: "This replaced 3 tools for us overnight.",
        author: "Sarah Chen",
        role: "CTO @ LaunchPad",
      },
      {
        quote: "We shipped our MVP in a single afternoon.",
        author: "Marcus Reid",
        role: "Founder @ Stackflow",
      },
      {
        quote: "Best investment we made this year.",
        author: "Priya Sharma",
        role: "VP Eng @ Datawise",
      },
    ],
  } = props;

  const cards = testimonials.slice(0, 3);
  const paddedCards =
    cards.length < 3
      ? [
          ...cards,
          ...Array.from({ length: 3 - cards.length }, (_, i) => ({
            quote: "An incredible product that changed everything.",
            author: `User ${cards.length + i + 1}`,
            role: "Customer",
          })),
        ]
      : cards;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookStatScene
            hook={hook}
            proofMetric={proofMetric}
            companyName={companyName}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 2: Testimonial Cards */}
        {paddedCards.map((test, i) => (
          <React.Fragment key={`test-card-${i}`}>
            <TransitionSeries.Sequence durationInFrames={180}>
              <TestimonialCard
                quote={test.quote}
                author={test.author}
                role={test.role}
                accentColor={accentColor}
                index={i}
                total={paddedCards.length}
              />
            </TransitionSeries.Sequence>
            {i < paddedCards.length - 1 && (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: TRANS })}
              />
            )}
          </React.Fragment>
        ))}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 3: Logo Wall */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <LogoWallScene proofLogos={proofLogos} accentColor={accentColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 4: CTA */}
        <TransitionSeries.Sequence durationInFrames={150}>
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
          <SFX type="rise" frame={0} />
          <SFX type="swipe" frame={75} />
          <SFX type="pop" frame={85} />
          <SFX type="swipe" frame={240} />
          <SFX type="pop" frame={250} />
          <SFX type="swipe" frame={390} />
          <SFX type="pop" frame={400} />
          <SFX type="ding" frame={665} />
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
