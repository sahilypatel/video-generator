import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface Particle {
  angle: number;
  speed: number;
  color: string;
  size: number;
  rotationSpeed: number;
  drag: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const COLORS = [
  "#FF8C68", "#FF5E68", "#FFD93D", "#6BCB77",
  "#4D96FF", "#9B59B6", "#FF6B9D", "#00D2D3",
];

interface ConfettiBurstProps {
  count?: number;
  triggerFrame?: number;
  accentColor?: string;
  originX?: number;
  originY?: number;
  seed?: number;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  count = 50,
  triggerFrame = 0,
  accentColor,
  originX = 50,
  originY = 50,
  seed = 42,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = accentColor ? [accentColor, ...COLORS] : COLORS;

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: seededRandom(seed + i * 7) * Math.PI * 2,
      speed: 4 + seededRandom(seed + i * 13) * 12,
      color: colors[Math.floor(seededRandom(seed + i * 3) * colors.length)],
      size: 4 + seededRandom(seed + i * 17) * 8,
      rotationSpeed: (seededRandom(seed + i * 23) - 0.5) * 15,
      drag: 0.92 + seededRandom(seed + i * 31) * 0.06,
    }));
  }, [count, seed, colors.length]);

  const localFrame = frame - triggerFrame;
  if (localFrame < 0) return null;

  const burstSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 30, stiffness: 80 },
  });

  const globalOpacity = interpolate(localFrame, [40, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: globalOpacity }}>
      {particles.map((p, i) => {
        let vx = Math.cos(p.angle) * p.speed;
        let vy = Math.sin(p.angle) * p.speed;
        let x = 0;
        let y = 0;

        const steps = Math.min(localFrame, 80);
        for (let s = 0; s < steps; s++) {
          x += vx;
          y += vy;
          vy += 0.25; // gravity
          vx *= p.drag;
          vy *= p.drag;
        }

        const rotation = localFrame * p.rotationSpeed;
        const scaleVal = interpolate(burstSpring, [0, 1], [0, 1]);
        const isRect = i % 3 !== 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${originX}%`,
              top: `${originY}%`,
              width: isRect ? p.size : p.size * 0.8,
              height: isRect ? p.size * 0.5 : p.size * 0.8,
              borderRadius: isRect ? 2 : "50%",
              background: p.color,
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scaleVal})`,
              opacity: interpolate(localFrame, [50, 80], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
