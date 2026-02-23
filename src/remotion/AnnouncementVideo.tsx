import React from "react";
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { VideoProps } from "./types";
import { Noise } from "./components/Noise";
import { FONT_FAMILY } from "./fonts";

const TRANSITION = 15;
const BG = "#0A0A0A";

// 3×TitleCard(~150) + VideoPlayback(360) + FinalTitleCard(150) + EndCard(120)
// minus 4×15 transitions = 60
// = 930 - 60 = 870 frames ≈ 29s at 30fps
export const TEMPLATE_20_FRAMES = 870;

// ─── Title Card Scene ────────────────────────────────────────────────────
// Typewriter effect: line 1 types first, then line 2 after a gap.
// Holds for a configurable number of frames after both lines finish.
const TitleCardScene: React.FC<{
  line1: string;
  line2: string;
  accentColor: string;
  typewriterSpeed: number;
  holdFrames: number;
}> = ({ line1, line2, accentColor, typewriterSpeed, holdFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const line1Start = 10;
  const line1Chars = Math.min(
    Math.floor(Math.max(0, frame - line1Start) / typewriterSpeed),
    line1.length,
  );
  const line1Done = line1Chars >= line1.length;
  const line1DoneFrame = line1Start + line1.length * typewriterSpeed;

  const line2Gap = 12;
  const line2StartFrame = line1DoneFrame + line2Gap;
  const line2Chars = Math.min(
    Math.floor(Math.max(0, frame - line2StartFrame) / typewriterSpeed),
    line2.length,
  );
  const line2Done = line2Chars >= line2.length;

  const visibleLine1 = line1.slice(0, line1Chars);
  const visibleLine2 = line2.slice(0, line2Chars);

  const showLine2 = frame >= line2StartFrame;

  // Blinking cursor logic: cursor shows on active line, blinks when done
  const line1CursorVisible = !line1Done || (!showLine2 && Math.floor(frame / 15) % 2 === 0);
  const line2CursorVisible = showLine2 && (!line2Done || Math.floor(frame / 15) % 2 === 0);

  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Subtle glow behind text
  const glowOpacity = interpolate(frame, [0, 40], [0, 0.6], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ background: BG, opacity: 1 - exit }}>
      <Noise opacity={0.012} />

      <div
        style={{
          position: "absolute",
          width: "50%",
          height: "30%",
          left: "25%",
          top: "35%",
          background: `radial-gradient(ellipse, ${accentColor}06 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          opacity: glowOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "0 160px",
        }}
      >
        {/* Line 1 */}
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 72,
            letterSpacing: -3,
            lineHeight: 1.15,
            color: "white",
            textAlign: "center",
            minHeight: "1.15em",
          }}
        >
          {visibleLine1}
          {!showLine2 && line1CursorVisible && (
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: "0.85em",
                background: accentColor,
                marginLeft: 3,
                verticalAlign: "text-bottom",
                borderRadius: 1,
              }}
            />
          )}
        </h1>

        {/* Line 2 */}
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 56,
            letterSpacing: -2,
            lineHeight: 1.15,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            minHeight: showLine2 ? "1.15em" : 0,
            opacity: showLine2 ? 1 : 0,
          }}
        >
          {visibleLine2}
          {line2CursorVisible && (
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: "0.85em",
                background: accentColor,
                marginLeft: 3,
                verticalAlign: "text-bottom",
                borderRadius: 1,
              }}
            />
          )}
        </h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Video Playback Scene with Zoom ──────────────────────────────────────
// Plays a video file full-screen with optional continuous zoom effect.
const VideoPlaybackScene: React.FC<{
  videoSrc: string;
  accentColor: string;
  zoomConfig?: {
    startFrame?: number;
    endScale?: number;
    originX?: string;
    originY?: string;
  };
}> = ({ videoSrc, accentColor, zoomConfig }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoomStart = zoomConfig?.startFrame ?? 60;
  const endScale = zoomConfig?.endScale ?? 1.25;
  const originX = zoomConfig?.originX ?? "50%";
  const originY = zoomConfig?.originY ?? "0%";

  const scale = interpolate(
    frame,
    [zoomStart, durationInFrames],
    [1, endScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  const entryOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          opacity: entryOpacity,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${scale})`,
            transformOrigin: `${originX} ${originY}`,
          }}
        >
          {videoSrc ? (
            <Video
              src={videoSrc}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          ) : (
            <AbsoluteFill
              style={{
                background: BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 24,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.15)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Screen recording placeholder
              </div>
            </AbsoluteFill>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── End Card Scene ──────────────────────────────────────────────────────
// Plays an end card video/animation full-screen.
const EndCardScene: React.FC<{
  videoSrc: string;
  accentColor: string;
}> = ({ videoSrc, accentColor }) => {
  const frame = useCurrentFrame();

  const entryOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BG, opacity: entryOpacity }}>
      {videoSrc ? (
        <Video
          src={videoSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <Noise opacity={0.012} />
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}60)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 60px ${accentColor}40`,
            }}
          >
            <svg
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline
                points="20 6 9 17 4 12"
                strokeDasharray={24}
                strokeDashoffset={interpolate(frame, [10, 30], [24, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                })}
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            End card placeholder
          </span>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ─── Helper: calculate duration per title card based on text length ──────
function calcTitleCardDuration(
  line1: string,
  line2: string,
  speed: number,
  holdFrames: number,
): number {
  const startDelay = 10;
  const line2Gap = 12;
  const typing = line1.length * speed + line2Gap + line2.length * speed;
  return startDelay + typing + holdFrames;
}

// ─── Main Composition ────────────────────────────────────────────────────
export const AnnouncementVideo: React.FC<VideoProps> = (props) => {
  const {
    accentColor,
    titleCards = [],
    announcementVideoSrc = "",
    announcementVideoDurationFrames = 360,
    announcementVideoZoom,
    endVideoSrc = "",
    endVideoDurationFrames = 120,
    typewriterSpeed = 1,
    holdFrames = 90,
  } = props;

  const defaultCards = [
    { line1: "Introducing something new", line2: "that changes everything." },
    { line1: "Built for speed", line2: "designed for clarity." },
    { line1: "Available now", line2: "try it today." },
  ];

  const cards = titleCards.length > 0 ? titleCards : defaultCards;

  const hasVideo = !!announcementVideoSrc;
  const hasEndCard = !!endVideoSrc;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <TransitionSeries>
        {/* Title Cards */}
        {cards.map((card, i) => {
          const cardDuration = calcTitleCardDuration(
            card.line1,
            card.line2,
            typewriterSpeed,
            holdFrames,
          );

          return (
            <React.Fragment key={`title-card-${i}`}>
              {i > 0 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION })}
                />
              )}
              <TransitionSeries.Sequence durationInFrames={cardDuration}>
                <TitleCardScene
                  line1={card.line1}
                  line2={card.line2}
                  accentColor={accentColor}
                  typewriterSpeed={typewriterSpeed}
                  holdFrames={holdFrames}
                />
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}

        {/* Video Playback (if provided) */}
        {hasVideo && (
          <>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
            <TransitionSeries.Sequence durationInFrames={announcementVideoDurationFrames}>
              <VideoPlaybackScene
                videoSrc={announcementVideoSrc}
                accentColor={accentColor}
                zoomConfig={announcementVideoZoom}
              />
            </TransitionSeries.Sequence>
          </>
        )}

        {/* End Card (if provided) */}
        {hasEndCard && (
          <>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
            <TransitionSeries.Sequence durationInFrames={endVideoDurationFrames}>
              <EndCardScene
                videoSrc={endVideoSrc}
                accentColor={accentColor}
              />
            </TransitionSeries.Sequence>
          </>
        )}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
