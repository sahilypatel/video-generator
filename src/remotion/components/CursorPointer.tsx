import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface CursorPointerProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
  clickAtFrame?: number;
  accentColor?: string;
}

export const CursorPointer: React.FC<CursorPointerProps> = ({
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  clickAtFrame,
  accentColor = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const moveProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const x = interpolate(moveProgress, [0, 1], [startX, endX]);
  const y = interpolate(moveProgress, [0, 1], [startY, endY]);

  const showClick = clickAtFrame != null && frame >= clickAtFrame;
  const clickSpring = showClick
    ? spring({
        frame: frame - clickAtFrame!,
        fps,
        config: { damping: 10, stiffness: 200 },
      })
    : 0;
  const ringScale = interpolate(clickSpring, [0, 1], [0.5, 2]);
  const ringOpacity = interpolate(clickSpring, [0, 1], [0.7, 0]);

  const cursorOpacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: cursorOpacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {showClick && (
        <div
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `2px solid ${accentColor}`,
            transform: `translate(-50%, -50%) scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />
      )}
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
      >
        <path
          d="M1 1L1 18L6 13.5L10 22L13 20.5L9 12L15 12L1 1Z"
          fill="white"
          stroke="#222"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
