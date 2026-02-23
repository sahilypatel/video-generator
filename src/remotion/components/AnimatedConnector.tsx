import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface AnimatedConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
  duration?: number;
  color?: string;
  dashed?: boolean;
  strokeWidth?: number;
}

export const AnimatedConnector: React.FC<AnimatedConnectorProps> = ({
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  duration = 30,
  color = "#3B82F6",
  dashed = false,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const dx = endX - startX;
  const dy = endY - startY;
  const lineLength = Math.sqrt(dx * dx + dy * dy);

  const drawProgress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const visibleLength = lineLength * drawProgress;
  const hiddenLength = lineLength - visibleLength;

  const arrowSize = 10;
  const angle = Math.atan2(dy, dx);
  const tipX = startX + dx * drawProgress;
  const tipY = startY + dy * drawProgress;

  const arrowLeft = `${tipX - arrowSize * Math.cos(angle - Math.PI / 6)},${tipY - arrowSize * Math.sin(angle - Math.PI / 6)}`;
  const arrowRight = `${tipX - arrowSize * Math.cos(angle + Math.PI / 6)},${tipY - arrowSize * Math.sin(angle + Math.PI / 6)}`;

  const arrowOpacity = interpolate(drawProgress, [0, 0.1, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const svgWidth = Math.max(Math.abs(dx) + 40, 40);
  const svgHeight = Math.max(Math.abs(dy) + 40, 40);
  const minX = Math.min(startX, endX) - 20;
  const minY = Math.min(startY, endY) - 20;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`${minX} ${minY} ${svgWidth} ${svgHeight}`}
      style={{ overflow: "visible", position: "absolute", top: 0, left: 0 }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? `${8} ${6}` : `${lineLength}`}
        strokeDashoffset={dashed ? 0 : hiddenLength}
        strokeLinecap="round"
        style={{
          opacity: dashed
            ? interpolate(drawProgress, [0, 0.05], [0, 1], {
                extrapolateRight: "clamp",
              })
            : 1,
        }}
      />
      {/* Arrowhead */}
      <polygon
        points={`${tipX},${tipY} ${arrowLeft} ${arrowRight}`}
        fill={color}
        opacity={arrowOpacity}
      />
    </svg>
  );
};
