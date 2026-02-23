import React, { useEffect, useState } from "react";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import {
  cancelRender,
  continueRender,
  delayRender,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface LottieIconProps {
  url: string;
  size?: number;
  delay?: number;
  accentColor?: string;
}

export const LottieIcon: React.FC<LottieIconProps> = ({
  url,
  size = 120,
  delay = 0,
  accentColor = "#FF8C68",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setAnimationData(json as LottieAnimationData);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle, url]);

  const enterSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  if (!animationData) return null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}42 100%)`,
        border: `1px solid ${accentColor}50`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${enterSpring})`,
        boxShadow: `0 0 50px ${accentColor}28, inset 0 1px 0 rgba(255,255,255,0.12)`,
        overflow: "hidden",
      }}
    >
      <Lottie
        animationData={animationData}
        style={{ width: size * 0.6, height: size * 0.6 }}
      />
    </div>
  );
};
