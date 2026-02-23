import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { evolvePath } from "@remotion/paths";

interface PathDrawProps {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  fill?: string;
}

export const PathDraw: React.FC<PathDrawProps> = ({
  d,
  stroke = "white",
  strokeWidth = 2,
  delay = 0,
  duration = 30,
  fill = "none",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const evolved = evolvePath(progress, d);

  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeDasharray={evolved.strokeDasharray}
      strokeDashoffset={evolved.strokeDashoffset}
      strokeLinecap="round"
    />
  );
};
