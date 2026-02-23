import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface HighlighterTextProps {
  children: string;
  color?: string;
  delay?: number;
  durationFrames?: number;
  style?: React.CSSProperties;
}

export const HighlighterText: React.FC<HighlighterTextProps> = ({
  children,
  color = "#FFE066",
  delay = 0,
  durationFrames = 30,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - delay, [0, durationFrames], [0, 105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <span
      style={{
        ...style,
        backgroundImage: `linear-gradient(90deg, ${color}45 ${progress}%, transparent ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 40%",
        backgroundPosition: "0 85%",
        padding: "0 4px",
        display: "inline",
      }}
    >
      {children}
    </span>
  );
};
