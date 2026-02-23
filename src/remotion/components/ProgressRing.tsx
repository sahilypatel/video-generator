import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";

interface ProgressRingProps {
  progress?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  delay?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 75,
  size = 200,
  strokeWidth = 12,
  color = "#3B82F6",
  delay = 0,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const animProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 80, mass: 1 },
  });

  const currentProgress = interpolate(animProgress, [0, 1], [0, progress]);
  const dashOffset = circumference - (currentProgress / 100) * circumference;

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const labelOpacity = interpolate(frame - delay, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: size,
        height: size,
        opacity,
        transform: `scale(${scaleSpring})`,
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontSize: size * 0.22,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "Inter, SF Pro Display, system-ui, sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(currentProgress)}%
        </span>
        {label && (
          <span
            style={{
              fontSize: size * 0.1,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Inter, system-ui, sans-serif",
              marginTop: 4,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
