import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

interface ZoomPanProps {
  children: React.ReactNode;
  startScale?: number;
  endScale?: number;
  startX?: number;
  endX?: number;
  startY?: number;
  endY?: number;
  delay?: number;
}

export const ZoomPan: React.FC<ZoomPanProps> = ({
  children,
  startScale = 1,
  endScale = 1.12,
  startX = 0,
  endX = -15,
  startY = 0,
  endY = -8,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame - delay,
    [0, durationInFrames - delay],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );

  const scale = interpolate(progress, [0, 1], [startScale, endScale]);
  const x = interpolate(progress, [0, 1], [startX, endX]);
  const y = interpolate(progress, [0, 1], [startY, endY]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
