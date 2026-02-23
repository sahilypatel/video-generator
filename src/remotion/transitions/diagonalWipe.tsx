import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type DiagonalWipeProps = Record<string, never>;

const DiagonalWipePresentation: React.FC<
  TransitionPresentationComponentProps<DiagonalWipeProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const p = presentationProgress * 200;

  return (
    <AbsoluteFill
      style={{
        clipPath: `polygon(0% 0%, ${p}% 0%, 0% ${p}%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const diagonalWipe = (): TransitionPresentation<DiagonalWipeProps> => {
  return {
    component: DiagonalWipePresentation,
    props: {} as DiagonalWipeProps,
  };
};
