import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface MeshGradientProps {
  colors?: string[];
  speed?: number;
}

export const MeshGradient: React.FC<MeshGradientProps> = ({
  colors = ["#FF8C68", "#6366f1", "#8b5cf6", "#ec4899"],
  speed = 0.015,
}) => {
  const frame = useCurrentFrame();

  const blobs = colors.map((color, i) => {
    const angle = (i / colors.length) * Math.PI * 2;
    const baseX = 50 + 25 * Math.cos(angle);
    const baseY = 50 + 25 * Math.sin(angle);
    const x = baseX + Math.sin(frame * speed + i * 1.5) * 15;
    const y = baseY + Math.cos(frame * speed * 0.8 + i * 2) * 12;
    const scale = interpolate(
      Math.sin(frame * speed * 0.5 + i),
      [-1, 1],
      [0.8, 1.2],
    );
    return { color, x, y, scale };
  });

  return (
    <AbsoluteFill style={{ background: "#060610", overflow: "hidden" }}>
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${blob.color}40 0%, ${blob.color}15 40%, transparent 70%)`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            transform: `translate(-50%, -50%) scale(${blob.scale})`,
            filter: "blur(60px)",
          }}
        />
      ))}
      <AbsoluteFill style={{ backdropFilter: "blur(40px)" }} />
    </AbsoluteFill>
  );
};
