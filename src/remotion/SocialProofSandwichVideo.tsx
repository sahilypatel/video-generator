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
import { VideoProps } from "./types";
import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { FloatingParticles } from "./components/FloatingParticles";
import { Noise } from "./components/Noise";
import { LogoWatermark } from "./components/LogoWatermark";
import { FeatureIcon } from "./components/FeatureIcon";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;

// OpeningProof(210) + Product(540) + ClosingProof(210) + CTA(150) - 3*15 = 1065
export const TEMPLATE_17_FRAMES = 1065;

const OpeningProofScene: React.FC<{
  stats: Array<{ label: string; value: string }>;
  awards: string[];
  hook?: string;
  problem?: string;
  accentColor: string;
}> = ({ stats, awards, hook, problem, accentColor }) => {
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
      <GradientBackground accentColor={accentColor} variant="hook" />
      <FloatingParticles count={18} color="rgba(255,255,255,0.12)" seed={17} />
      <Noise opacity={0.025} />

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
        {hook ? (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, calc(-50% - 140px))",
              fontFamily: FONT_FAMILY,
              fontSize: 36,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              margin: 0,
              opacity: interpolate(frame, [0, 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {hook}
          </p>
        ) : null}
        {problem ? (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, calc(-50% - 95px))",
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              margin: 0,
              opacity: interpolate(frame, [10, 28], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {problem}
          </p>
        ) : null}
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
          }}
        >
          {stats.slice(0, 3).map((stat, i) => {
            const delay = 5 + i * 12;
            const statSpring = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 130 },
            });
            const statScale = interpolate(statSpring, [0, 1], [0.6, 1]);
            const statOpacity = interpolate(
              frame,
              [delay, delay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            const numStr = stat.value.replace(/[^0-9.]/g, "");
            const suffix = stat.value.replace(/[0-9.,]/g, "").trim();
            const target = parseFloat(numStr) || 0;
            const isDecimal = stat.value.includes(".");
            const counterRaw = interpolate(
              frame,
              [delay + 10, delay + 70],
              [0, target],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            );
            const counterDisplay = isDecimal
              ? counterRaw.toFixed(1)
              : Math.round(counterRaw).toLocaleString();

            return (
              <div
                key={i}
                style={{
                  opacity: statOpacity,
                  transform: `scale(${statScale})`,
                  textAlign: "center",
                  minWidth: 180,
                }}
              >
                <h2
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 80,
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: -3,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {counterDisplay}
                  {suffix}
                </h2>
                <p
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    margin: "8px 0 0",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Award badges */}
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {awards.slice(0, 3).map((award, i) => {
            const badgeDelay = 70 + i * 12;
            const badgeSpring = spring({
              frame: frame - badgeDelay,
              fps,
              config: { damping: 11, stiffness: 140 },
            });
            const badgeScale = interpolate(badgeSpring, [0, 1], [0.4, 1]);
            const badgeOpacity = interpolate(
              frame,
              [badgeDelay, badgeDelay + 12],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={i}
                style={{
                  opacity: badgeOpacity,
                  transform: `scale(${badgeScale})`,
                  background: `${accentColor}12`,
                  border: `1px solid ${accentColor}35`,
                  borderRadius: 14,
                  padding: "10px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>🏆</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {award}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ProductScene: React.FC<{
  features: Array<{ icon: string; title: string; description: string }>;
  companyName: string;
  accentColor: string;
}> = ({ features, companyName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const displayFeatures = features.slice(0, 4);
  const paddedFeatures =
    displayFeatures.length < 4
      ? [
          ...displayFeatures,
          ...Array.from({ length: 4 - displayFeatures.length }, (_, i) => ({
            icon: ["🔒", "📈", "🔗", "⚙️"][i % 4],
            title: `Feature ${displayFeatures.length + i + 1}`,
            description: "Enterprise-grade capability",
          })),
        ]
      : displayFeatures;

  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
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
      <GradientBackground accentColor={accentColor} variant="feature" />
      <FloatingParticles count={14} color={`${accentColor}22`} seed={71} />
      <Noise opacity={0.02} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 32,
        }}
      >
        <div style={{ opacity: titleOpacity, textAlign: "center" }}>
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
            Inside {companyName}
          </span>
        </div>

        {/* 2×2 grid with staggered scale-in */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
            maxWidth: 920,
            width: "100%",
          }}
        >
          {paddedFeatures.map((feat, i) => {
            const gridDelay = 20 + i * 18;
            const gridSpring = spring({
              frame: frame - gridDelay,
              fps,
              config: { damping: 12, stiffness: 110, mass: 0.8 },
            });
            const gridScale = interpolate(gridSpring, [0, 1], [0.5, 1]);
            const gridOpacity = interpolate(
              frame,
              [gridDelay, gridDelay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={i}
                style={{
                  opacity: gridOpacity,
                  transform: `scale(${gridScale})`,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${accentColor}20`,
                  borderRadius: 22,
                  padding: "30px 26px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "center",
                }}
              >
                <FeatureIcon
                  icon={feat.icon}
                  accentColor={accentColor}
                  size={56}
                />
                <h4
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 24,
                    fontWeight: 700,
                    color: "white",
                    margin: 0,
                  }}
                >
                  {feat.title}
                </h4>
                <p
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 15,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.45)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ClosingProofScene: React.FC<{
  proofLogos: string[];
  testimonials: Array<{ quote: string; author: string; role: string }>;
  accentColor: string;
}> = ({ proofLogos, testimonials, accentColor }) => {
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
      <GradientBackground accentColor={accentColor} variant="solution" />
      <FloatingParticles count={12} color={`${accentColor}30`} seed={82} />
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
        {/* Logo wall */}
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {proofLogos.slice(0, 5).map((logo, i) => {
            const logoDelay = 5 + i * 8;
            const logoOpacity = interpolate(
              frame,
              [logoDelay, logoDelay + 18],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const logoY = interpolate(
              frame,
              [logoDelay, logoDelay + 18],
              [14, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={logo}
                style={{
                  opacity: logoOpacity,
                  transform: `translateY(${logoY}px)`,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 14,
                  padding: "12px 24px",
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {logo}
              </div>
            );
          })}
        </div>

        {/* Star ratings + testimonial cards */}
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {testimonials.slice(0, 3).map((test, i) => {
            const cardDelay = 50 + i * 20;
            const cardSpring = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const cardScale = interpolate(cardSpring, [0, 1], [0.7, 1]);
            const cardOpacity = interpolate(
              frame,
              [cardDelay, cardDelay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            const starRevealWidth = interpolate(
              frame,
              [cardDelay + 5, cardDelay + 25],
              [0, 100],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            );

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${accentColor}25`,
                  borderRadius: 20,
                  padding: "24px 28px",
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Star rating */}
                <div
                  style={{
                    overflow: "hidden",
                    width: `${starRevealWidth}%`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {"★★★★★".split("").map((star, si) => (
                    <span
                      key={si}
                      style={{ color: "#FFD700", fontSize: 16 }}
                    >
                      {star}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 500,
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div>
                  <p
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {test.author}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 12,
                      fontWeight: 500,
                      color: accentColor,
                      margin: "2px 0 0",
                    }}
                  >
                    {test.role}
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

const TwoButtonCtaScene: React.FC<{
  cta: string;
  websiteUrl: string;
  companyName: string;
  tagline?: string;
  solution?: string;
  accentColor: string;
}> = ({ cta, websiteUrl, companyName, tagline, solution, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryScale = interpolate(
    spring({ frame, fps, config: { damping: 13, stiffness: 120 } }),
    [0, 1],
    [0.88, 1],
  );

  const pulse = interpolate(Math.sin(frame * 0.09), [-1, 1], [1, 1.025]);
  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.25, 0.5]);

  const secondBtnDelay = 35;
  const secondBtnOpacity = interpolate(
    frame,
    [secondBtnDelay, secondBtnDelay + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const secondBtnScale = interpolate(
    spring({
      frame: frame - secondBtnDelay,
      fps,
      config: { damping: 14, stiffness: 120 },
    }),
    [0, 1],
    [0.7, 1],
  );

  return (
    <AbsoluteFill>
      <GradientBackground accentColor={accentColor} variant="cta" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 45% at 50% 48%, ${accentColor}${Math.round(glowPulse * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <FloatingParticles count={22} color={`${accentColor}35`} seed={17} />
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
        {solution ? (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, calc(-50% - 120px))",
              fontFamily: FONT_FAMILY,
              fontSize: 22,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              textAlign: "center",
              margin: 0,
              width: "100%",
              maxWidth: 700,
              opacity: interpolate(frame, [0, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {solution}
          </p>
        ) : null}
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 78,
            letterSpacing: -3,
            lineHeight: 1.08,
            color: "white",
            textAlign: "center",
          }}
        >
          <AnimatedText
            split="word"
            animation="slam"
            staggerFrames={4}
            delay={5}
            yOffset={35}
          >
            {cta}
          </AnimatedText>
        </h2>

        {/* Two-button layout */}
        <div
          style={{
            display: "flex",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${pulse})`,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${accentColor}, #FF5E68)`,
              padding: "20px 48px",
              boxShadow: `0 18px 52px ${accentColor}55`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                fontWeight: 700,
                color: "white",
              }}
            >
              {cta}
            </span>
          </div>

          <div
            style={{
              opacity: secondBtnOpacity,
              transform: `scale(${secondBtnScale})`,
              borderRadius: 20,
              border: `2px solid rgba(255,255,255,0.25)`,
              background: "rgba(255,255,255,0.06)",
              padding: "18px 40px",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 22,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Book a demo
            </span>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 20,
            color: `${accentColor}bb`,
            letterSpacing: 1,
            opacity: interpolate(frame, [50, 65], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {websiteUrl}
        </p>
        {tagline ? (
          <p
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
              textAlign: "center",
              opacity: interpolate(frame, [60, 80], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {tagline}
          </p>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SocialProofSandwichVideo: React.FC<VideoProps> = (props) => {
  const {
    companyName,
    features,
    cta,
    websiteUrl,
    accentColor,
    logoUrl,
    tagline = "",
    hook = "",
    problem = "",
    solution = "",
    stats = [
      { label: "Active users", value: "50,000+" },
      { label: "Average rating", value: "4.9" },
      { label: "Companies", value: "500+" },
    ],
    awards = ["Product of the Year", "Best in Class", "Editor's Choice"],
    proofLogos = ["Notion", "Vercel", "Stripe", "Linear", "Figma"],
    testimonials = [
      { quote: "This replaced 3 tools overnight.", author: "Sarah Chen", role: "CTO @ LaunchPad" },
      { quote: "We shipped our MVP in an afternoon.", author: "Marcus Reid", role: "Founder @ Stackflow" },
      { quote: "Best investment this year.", author: "Priya Sharma", role: "VP Eng @ Datawise" },
    ],
  } = props;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={210}>
          <OpeningProofScene
            stats={stats}
            awards={awards}
            hook={hook}
            problem={problem}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={540}>
          <ProductScene
            features={features}
            companyName={companyName}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={210}>
          <ClosingProofScene
            proofLogos={proofLogos}
            testimonials={testimonials}
            accentColor={accentColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <TwoButtonCtaScene
            cta={cta}
            websiteUrl={websiteUrl}
            companyName={companyName}
            tagline={tagline}
            solution={solution}
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
