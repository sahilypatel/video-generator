import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type CircleRevealProps = Record<string, never>;

const CircleRevealPresentation: React.FC<
  TransitionPresentationComponentProps<CircleRevealProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const radius = presentationProgress * 150;

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radius}% at 50% 50%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const circleReveal = (): TransitionPresentation<CircleRevealProps> => {
  return {
    component: CircleRevealPresentation,
    props: {} as CircleRevealProps,
  };
};
