import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface NoiseProps {
  opacity?: number;
  speed?: number;
}

export const Noise: React.FC<NoiseProps> = ({
  opacity = 0.03,
  speed = 4,
}) => {
  const frame = useCurrentFrame();

  const svgDataUrl = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="${Math.floor(frame / speed)}" stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(#n)" opacity="1"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, [frame, speed]);

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${svgDataUrl}")`,
        backgroundRepeat: "repeat",
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
