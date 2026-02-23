import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface GradientTextProps {
  children: string;
  colors?: string[];
  angle?: number;
  animate?: boolean;
  style?: React.CSSProperties;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors = ["#3B82F6", "#8B5CF6", "#EC4899"],
  angle = 90,
  animate = true,
  style,
}) => {
  const frame = useCurrentFrame();

  const shift = animate
    ? interpolate(frame, [0, 120], [0, 100], {
        extrapolateRight: "extend",
        easing: Easing.linear,
      })
    : 0;

  const colorStops = colors
    .map((c, i) => {
      const pct = (i / (colors.length - 1)) * 100 + shift;
      return `${c} ${pct}%`;
    })
    .join(", ");

  const repeatedStops = [
    ...colors.map((c, i) => {
      const pct = (i / (colors.length - 1)) * 100 + shift;
      return `${c} ${pct}%`;
    }),
    ...colors.map((c, i) => {
      const pct = (i / (colors.length - 1)) * 100 + shift + 100;
      return `${c} ${pct}%`;
    }),
  ].join(", ");

  return (
    <span
      style={{
        display: "inline-block",
        backgroundImage: `linear-gradient(${angle}deg, ${animate ? repeatedStops : colorStops})`,
        backgroundSize: animate ? "200% 100%" : "100% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: 700,
        fontFamily: "Inter, SF Pro Display, system-ui, sans-serif",
        ...style,
      }}
    >
      {children}
    </span>
  );
};
