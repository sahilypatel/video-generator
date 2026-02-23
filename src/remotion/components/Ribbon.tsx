import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type RibbonPosition = "top-right" | "top-left";

interface RibbonProps {
  text?: string;
  color?: string;
  delay?: number;
  position?: RibbonPosition;
}

export const Ribbon: React.FC<RibbonProps> = ({
  text = "NEW",
  color = "#EF4444",
  delay = 0,
  position = "top-right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 130, mass: 0.8 },
  });

  const isRight = position === "top-right";
  const translateX = interpolate(slideSpring, [0, 1], [isRight ? 80 : -80, 0]);
  const translateY = interpolate(slideSpring, [0, 1], [-40, 0]);
  const opacity = interpolate(frame - delay, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = isRight ? 45 : -45;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        [isRight ? "right" : "left"]: 0,
        width: 150,
        height: 150,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 28,
          [isRight ? "right" : "left"]: -35,
          width: 220,
          textAlign: "center",
          transform: `rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`,
          opacity,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            background: color,
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            fontFamily: "Inter, SF Pro Display, system-ui, sans-serif",
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "8px 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
