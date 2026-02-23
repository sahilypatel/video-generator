import React from "react";
import { Audio, staticFile } from "remotion";

interface BackgroundMusicProps {
  track?: "ambient" | "upbeat" | "cinematic";
  volume?: number;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  track = "ambient",
  volume = 0.15,
}) => {
  return (
    <Audio
      src={staticFile(`music/${track}.wav`)}
      volume={volume}
      loop
    />
  );
};
