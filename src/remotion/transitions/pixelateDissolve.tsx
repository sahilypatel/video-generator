import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type PixelateDissolveProps = Record<string, never>;

const PixelateDissolvePresentation: React.FC<
  TransitionPresentationComponentProps<PixelateDissolveProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "exiting") {
    const blur = presentationProgress * 20;
    const opacity = 1 - presentationProgress;

    return (
      <AbsoluteFill
        style={{
          filter: `blur(${blur}px)`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const blur = (1 - presentationProgress) * 20;
  const opacity = presentationProgress;

  return (
    <AbsoluteFill
      style={{
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const pixelateDissolve = (): TransitionPresentation<PixelateDissolveProps> => {
  return {
    component: PixelateDissolvePresentation,
    props: {} as PixelateDissolveProps,
  };
};
