import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { noise3D } from "@remotion/noise";

interface NoiseDotGridProps {
  rows?: number;
  cols?: number;
  color?: string;
  speed?: number;
  dotRadius?: number;
  maxOffset?: number;
}

export const NoiseDotGrid: React.FC<NoiseDotGridProps> = ({
  rows = 8,
  cols = 12,
  color = "rgba(255,255,255,0.15)",
  speed = 0.008,
  dotRadius = 3,
  maxOffset = 30,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const overscan = 80;

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {Array.from({ length: cols }).map((_, i) =>
        Array.from({ length: rows }).map((_, j) => {
          const x = i * ((width + overscan) / cols);
          const y = j * ((height + overscan) / rows);
          const px = i / cols;
          const py = j / rows;
          const dx = noise3D("x", px, py, frame * speed) * maxOffset;
          const dy = noise3D("y", px, py, frame * speed) * maxOffset;
          const opacity = interpolate(
            noise3D("opacity", i, j, frame * speed),
            [-1, 1],
            [0.1, 0.6],
          );
          return (
            <circle
              key={`${i}-${j}`}
              cx={x + dx}
              cy={y + dy}
              r={dotRadius}
              fill={color}
              opacity={opacity}
            />
          );
        }),
      )}
    </svg>
  );
};
