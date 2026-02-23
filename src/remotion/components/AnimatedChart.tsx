import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONT_FAMILY } from "../fonts";

interface ChartBar {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedChartProps {
  data: ChartBar[];
  delay?: number;
  accentColor?: string;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  delay = 0,
  accentColor = "#FF8C68",
  width = 500,
  height = 280,
  showLabels = true,
  showValues = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));
  const barGap = 16;
  const labelHeight = showLabels ? 30 : 0;
  const valueHeight = showValues ? 30 : 0;
  const barAreaHeight = height - labelHeight - valueHeight;
  const barWidth = (width - (data.length - 1) * barGap) / data.length;
  const STAGGER = 6;

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "flex-end",
        gap: barGap,
      }}
    >
      {data.map((item, i) => {
        const barDelay = delay + i * STAGGER;
        const barSpring = spring({
          frame: frame - barDelay,
          fps,
          config: { damping: 14, stiffness: 100 },
        });
        const barH = barSpring * (item.value / maxValue) * barAreaHeight;
        const color = item.color || accentColor;
        const valueOpacity = interpolate(
          frame - barDelay - 10,
          [0, 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const labelOpacity = interpolate(
          frame - barDelay - 5,
          [0, 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              width: barWidth,
            }}
          >
            {showValues && (
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "white",
                  opacity: valueOpacity,
                }}
              >
                {Math.round(barSpring * item.value)}
              </span>
            )}
            <div
              style={{
                width: barWidth,
                height: barH,
                background: `linear-gradient(180deg, ${color}, ${color}88)`,
                borderRadius: 6,
                boxShadow: `0 0 20px ${color}30`,
                minHeight: 2,
              }}
            />
            {showLabels && (
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                  opacity: labelOpacity,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: barWidth,
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
