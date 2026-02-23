import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface ShineEffectProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  angle?: number;
}

export const ShineEffect: React.FC<ShineEffectProps> = ({
  children,
  delay = 0,
  duration = 30,
  angle = 25,
}) => {
  const frame = useCurrentFrame();

  const adjustedFrame = Math.max(0, frame - delay);

  const shinePosition = interpolate(adjustedFrame, [0, duration], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const shineOpacity = interpolate(
    adjustedFrame,
    [0, duration * 0.1, duration * 0.5, duration],
    [0, 0.7, 0.7, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(${angle}deg, transparent 0%, rgba(255,255,255,0) ${shinePosition - 20}%, rgba(255,255,255,0.5) ${shinePosition}%, rgba(255,255,255,0) ${shinePosition + 20}%, transparent 100%)`,
            opacity: shineOpacity,
          }}
        />
      </div>
    </div>
  );
};
