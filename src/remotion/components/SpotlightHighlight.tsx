import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface Position {
  x: number;
  y: number;
}

interface SpotlightHighlightProps {
  positions: Position[];
  delay?: number;
  size?: number;
  color?: string;
  children: React.ReactNode;
}

export const SpotlightHighlight: React.FC<SpotlightHighlightProps> = ({
  positions,
  delay = 0,
  size = 200,
  color = "rgba(255,255,255,0.9)",
  children,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const segmentCount = Math.max(positions.length - 1, 1);
  const framesPerSegment = 30;
  const totalDuration = segmentCount * framesPerSegment;

  const rawProgress = interpolate(
    adjustedFrame,
    [0, totalDuration],
    [0, segmentCount],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  const segmentIndex = Math.min(
    Math.floor(rawProgress),
    positions.length - 2
  );
  const segmentT = rawProgress - segmentIndex;

  const safeIndex = Math.max(0, Math.min(segmentIndex, positions.length - 2));
  const from = positions[safeIndex];
  const to = positions[Math.min(safeIndex + 1, positions.length - 1)];

  const spotX = interpolate(segmentT, [0, 1], [from.x, to.x]);
  const spotY = interpolate(segmentT, [0, 1], [from.y, to.y]);

  const fadeIn = interpolate(adjustedFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle ${size}px at ${spotX}% ${spotY}%, transparent 0%, rgba(0,0,0,0.85) 100%)`,
          opacity: fadeIn,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${spotX}%`,
          top: `${spotY}%`,
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 ${size * 0.4}px ${size * 0.15}px ${color}`,
          opacity: fadeIn * 0.3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
