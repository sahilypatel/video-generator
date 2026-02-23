import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.5,
  direction = "up",
}) => {
  const frame = useCurrentFrame();
  const offset = frame * speed;

  const transform = {
    up: `translateY(${-offset}px)`,
    down: `translateY(${offset}px)`,
    left: `translateX(${-offset}px)`,
    right: `translateX(${offset}px)`,
  }[direction];

  return <AbsoluteFill style={{ transform }}>{children}</AbsoluteFill>;
};
