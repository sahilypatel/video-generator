import React from "react";
import {
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY } from "../fonts";

interface LogoWatermarkProps {
  logoUrl?: string | null;
  companyName: string;
  accentColor: string;
}

export const LogoWatermark: React.FC<LogoWatermarkProps> = ({
  logoUrl,
  companyName,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 8,
  });
  const opacity = interpolate(entryProgress, [0, 1], [0, 0.85]);
  const x = interpolate(entryProgress, [0, 1], [20, 0]);

  if (!logoUrl) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        right: 44,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <Img
        src={logoUrl}
        style={{
          width: 36,
          height: 36,
          objectFit: "contain",
          borderRadius: 8,
        }}
      />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 15,
          fontWeight: 700,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: -0.3,
        }}
      >
        {companyName}
      </span>
    </div>
  );
};
