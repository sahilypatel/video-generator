import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface WaveformBarProps {
  bars?: number;
  color?: string;
  height?: number;
  gap?: number;
  barWidth?: number;
  speed?: number;
}

export const WaveformBar: React.FC<WaveformBarProps> = ({
  bars = 32,
  color = "rgba(255,255,255,0.3)",
  height = 60,
  gap = 3,
  barWidth = 3,
  speed = 0.15,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", alignItems: "center", gap, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const phase = i * 0.3;
        const barHeight = interpolate(
          Math.sin(frame * speed + phase),
          [-1, 1],
          [height * 0.15, height * 0.9],
        );
        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: color,
              borderRadius: barWidth / 2,
            }}
          />
        );
      })}
    </div>
  );
};
