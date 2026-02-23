import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

type SplitMode = "word" | "character" | "none";
type AnimationMode = "fade-up" | "slam" | "scale-in" | "rotate-in";

interface AnimatedTextProps {
  children: string;
  split?: SplitMode;
  animation?: AnimationMode;
  staggerFrames?: number;
  durationPerUnit?: number;
  delay?: number;
  yOffset?: number;
  blurAmount?: number;
  style?: React.CSSProperties;
  useSpring?: boolean;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
}

const SPRING_CONFIGS: Record<AnimationMode, { damping: number; stiffness: number; mass?: number }> = {
  "fade-up": { damping: 200, stiffness: 100 },
  "slam": { damping: 8, stiffness: 180 },
  "scale-in": { damping: 12, stiffness: 120 },
  "rotate-in": { damping: 14, stiffness: 100 },
};

function getUnitStyle(
  mode: AnimationMode,
  progress: number,
  yOffset: number,
  blurAmount: number,
): React.CSSProperties {
  switch (mode) {
    case "slam": {
      const scale = interpolate(progress, [0, 1], [2.8, 1]);
      const y = interpolate(progress, [0, 1], [-50, 0]);
      return {
        opacity: Math.min(progress * 3, 1),
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blurAmount > 0
          ? `blur(${interpolate(progress, [0, 1], [blurAmount * 1.5, 0])}px)`
          : undefined,
      };
    }
    case "scale-in": {
      const scale = interpolate(progress, [0, 1], [0, 1]);
      return {
        opacity: progress,
        transform: `scale(${scale})`,
      };
    }
    case "rotate-in": {
      const rotation = interpolate(progress, [0, 1], [-20, 0]);
      const y = interpolate(progress, [0, 1], [yOffset * 0.5, 0]);
      return {
        opacity: progress,
        transform: `translateY(${y}px) rotate(${rotation}deg)`,
        transformOrigin: "center bottom",
      };
    }
    default: {
      const y = interpolate(progress, [0, 1], [yOffset, 0]);
      const blur = interpolate(progress, [0, 1], [blurAmount, 0]);
      return {
        opacity: progress,
        transform: `translateY(${y}px)`,
        filter: blurAmount > 0 ? `blur(${blur}px)` : undefined,
      };
    }
  }
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  split = "word",
  animation = "fade-up",
  staggerFrames = 3,
  durationPerUnit = 20,
  delay = 0,
  yOffset = 30,
  blurAmount = 8,
  style,
  useSpring: useSpringAnim = false,
  springConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const resolvedSpringConfig = springConfig ?? SPRING_CONFIGS[animation];
  const useSpringForMode = useSpringAnim || animation !== "fade-up";

  if (split === "none") {
    const adjustedFrame = Math.max(0, frame - delay);
    let progress: number;
    if (useSpringForMode) {
      progress = spring({ frame: frame - delay, fps, config: resolvedSpringConfig });
    } else {
      progress = interpolate(adjustedFrame, [0, durationPerUnit], [0, 1], {
        extrapolateRight: "clamp",
      });
    }
    const unitStyle = getUnitStyle(animation, progress, yOffset, blurAmount);
    return (
      <span style={{ display: "inline-block", ...unitStyle, ...style }}>
        {children}
      </span>
    );
  }

  const units = split === "word" ? children.split(/(\s+)/) : children.split("");

  let wordIdx = 0;
  return (
    <span style={{ display: "inline", ...style }}>
      {units.map((unit, i) => {
        const isSpace = /^\s+$/.test(unit);
        if (isSpace) {
          return (
            <span key={i} style={{ display: "inline", whiteSpace: "pre" }}>
              {unit}
            </span>
          );
        }

        const currentWordIdx = wordIdx++;
        const unitDelay = delay + currentWordIdx * staggerFrames;
        const adjustedFrame = Math.max(0, frame - unitDelay);

        let progress: number;
        if (useSpringForMode) {
          progress = spring({
            frame: frame - unitDelay,
            fps,
            config: resolvedSpringConfig,
          });
        } else {
          progress = interpolate(
            adjustedFrame,
            [0, durationPerUnit],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
        }

        const unitStyle = getUnitStyle(animation, progress, yOffset, blurAmount);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              ...unitStyle,
              whiteSpace: "pre",
            }}
          >
            {unit}
          </span>
        );
      })}
    </span>
  );
};
