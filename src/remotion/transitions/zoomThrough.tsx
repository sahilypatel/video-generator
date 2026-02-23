import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type ZoomThroughProps = Record<string, never>;

const ZoomThroughPresentation: React.FC<
  TransitionPresentationComponentProps<ZoomThroughProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "exiting") {
    const scale = 1 + presentationProgress * 2;
    const opacity = 1 - presentationProgress;

    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const scale = 2 - presentationProgress;
  const opacity = presentationProgress;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoomThrough = (): TransitionPresentation<ZoomThroughProps> => {
  return {
    component: ZoomThroughPresentation,
    props: {} as ZoomThroughProps,
  };
};
