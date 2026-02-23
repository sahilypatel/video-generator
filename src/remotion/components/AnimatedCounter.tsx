import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface AnimatedCounterProps {
  targetValue: number | string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  style?: React.CSSProperties;
  fontSize?: number;
}

function parseTarget(value: number | string): number {
  if (typeof value === "number") return value;
  return Number(value.replace(/[^0-9.-]/g, "")) || 0;
}

function formatWithCommas(n: number, hasDecimals: boolean): string {
  if (hasDecimals) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return Math.round(n).toLocaleString("en-US");
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  suffix = "",
  prefix = "",
  duration,
  delay = 0,
  style,
  fontSize = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const target = parseTarget(targetValue);
  const hasDecimals =
    typeof targetValue === "string" && targetValue.includes(".");

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 28, stiffness: 120, mass: 1 },
    ...(duration ? { durationInFrames: duration } : {}),
  });

  const currentValue = interpolate(progress, [0, 1], [0, target]);

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, SF Pro Display, system-ui, sans-serif",
        fontSize,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {prefix}
      {formatWithCommas(currentValue, hasDecimals)}
      {suffix}
    </div>
  );
};
