import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type SlideRotateProps = Record<string, never>;

const SlideRotatePresentation: React.FC<
  TransitionPresentationComponentProps<SlideRotateProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "exiting") {
    const translateX = -presentationProgress * 100;
    const rotate = -presentationProgress * 15;

    return (
      <AbsoluteFill
        style={{
          transform: `translateX(${translateX}%) rotate(${rotate}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const translateX = (1 - presentationProgress) * 100;
  const rotate = (1 - presentationProgress) * 15;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}%) rotate(${rotate}deg)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const slideRotate = (): TransitionPresentation<SlideRotateProps> => {
  return {
    component: SlideRotatePresentation,
    props: {} as SlideRotateProps,
  };
};
