import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: React.ReactNode;
  durationInFrames?: number;
  delay?: number;
  direction?: Direction;
  distance?: number;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
  absolute?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  durationInFrames = 20,
  delay = 0,
  direction = "up",
  distance = 30,
  easing = Easing.out(Easing.cubic),
  style,
  absolute = true,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const opacity = interpolate(adjustedFrame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing,
  });

  const offset = interpolate(
    adjustedFrame,
    [0, durationInFrames],
    [distance, 0],
    { extrapolateRight: "clamp", easing }
  );

  const transform = (() => {
    switch (direction) {
      case "up":
        return `translateY(${offset}px)`;
      case "down":
        return `translateY(${-offset}px)`;
      case "left":
        return `translateX(${offset}px)`;
      case "right":
        return `translateX(${-offset}px)`;
      default:
        return "none";
    }
  })();

  const Wrapper = absolute ? AbsoluteFill : "div";

  return (
    <Wrapper style={{ opacity, transform, ...style }}>{children}</Wrapper>
  );
};
