import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface StickerPopProps {
  children: React.ReactNode;
  delay?: number;
  size?: number;
  rotation?: number;
}

export const StickerPop: React.FC<StickerPopProps> = ({
  children,
  delay = 0,
  size = 80,
  rotation = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 6, stiffness: 150, mass: 0.8 },
  });

  const rotateSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.6 },
  });

  const scale = interpolate(scaleSpring, [0, 1], [0, 1]);
  const rotate = interpolate(rotateSpring, [0, 1], [-rotation, rotation * 0.1]);

  const opacity = interpolate(frame - delay, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size,
        lineHeight: 1,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
