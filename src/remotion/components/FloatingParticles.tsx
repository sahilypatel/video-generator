import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
  drift: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  seed?: number;
  fadeInDuration?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 30,
  color = "rgba(255,255,255,0.4)",
  maxSize = 4,
  speed = 0.3,
  seed = 42,
  fadeInDuration = 30,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: seededRandom(seed + i * 7) * 100,
      y: seededRandom(seed + i * 13) * 100,
      size: 1 + seededRandom(seed + i * 3) * (maxSize - 1),
      speed: 0.5 + seededRandom(seed + i * 17) * speed,
      opacity: 0.2 + seededRandom(seed + i * 23) * 0.6,
      delay: seededRandom(seed + i * 31) * 60,
      drift: (seededRandom(seed + i * 37) - 0.5) * 0.3,
    }));
  }, [count, maxSize, speed, seed]);

  const globalOpacity = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: globalOpacity, pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const yOffset = (frame * p.speed) % 120;
        const xOffset = Math.sin((frame + p.delay) * 0.02) * 20 * p.drift;

        const flickerPhase = Math.sin((frame + p.delay) * 0.08);
        const flicker = interpolate(flickerPhase, [-1, 1], [0.4, 1]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + xOffset}%`,
              top: `${((p.y - yOffset + 120) % 120) - 10}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity: p.opacity * flicker,
              boxShadow: p.size > 2 ? `0 0 ${p.size * 2}px ${color}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
