import React from "react";
import { Audio, staticFile, Sequence } from "remotion";

export type SFXType = "whoosh" | "pop" | "impact" | "rise" | "click" | "ding" | "swipe";

interface SFXProps {
  type: SFXType;
  frame: number;
  volume?: number;
}

const DURATIONS: Record<SFXType, number> = {
  whoosh: 8,
  pop: 3,
  impact: 9,
  rise: 15,
  click: 2,
  ding: 18,
  swipe: 6,
};

export const SFX: React.FC<SFXProps> = ({ type, frame, volume = 0.3 }) => {
  return (
    <Sequence from={frame} durationInFrames={DURATIONS[type]}>
      <Audio src={staticFile(`sfx/${type}.wav`)} volume={volume} />
    </Sequence>
  );
};
