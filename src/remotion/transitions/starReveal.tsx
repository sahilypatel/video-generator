import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type StarRevealProps = Record<string, never>;

function starClipPath(progress: number): string {
  const size = progress * 60;
  const cx = 50;
  const cy = 50;
  const outerR = size;
  const innerR = size * 0.38;
  const points: string[] = [];

  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 180) * (i * 72 - 90);
    const innerAngle = (Math.PI / 180) * (i * 72 + 36 - 90);

    points.push(
      `${cx + outerR * Math.cos(outerAngle)}% ${cy + outerR * Math.sin(outerAngle)}%`
    );
    points.push(
      `${cx + innerR * Math.cos(innerAngle)}% ${cy + innerR * Math.sin(innerAngle)}%`
    );
  }

  return `polygon(${points.join(", ")})`;
}

const StarRevealPresentation: React.FC<
  TransitionPresentationComponentProps<StarRevealProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  return (
    <AbsoluteFill
      style={{
        clipPath: starClipPath(presentationProgress),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const starReveal = (): TransitionPresentation<StarRevealProps> => {
  return {
    component: StarRevealPresentation,
    props: {} as StarRevealProps,
  };
};
