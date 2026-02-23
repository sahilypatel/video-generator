import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

interface CountUpTextProps {
  value: string;
  delay?: number;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  label?: string;
}

export const CountUpText: React.FC<CountUpTextProps> = ({
  value,
  delay = 0,
  style,
  labelStyle,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 60, stiffness: 80 },
  });

  const match = value.match(/([$€£]?)([0-9,.]+)([%+kKmMbB]*.*)/);
  if (!match) {
    return <span style={style}>{value}</span>;
  }

  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const suffix = match[3];
  const targetNum = parseFloat(numStr);

  if (isNaN(targetNum)) {
    return <span style={style}>{value}</span>;
  }

  const currentNum = targetNum * progress;

  const isDecimal = numStr.includes(".");
  const decimals = isDecimal ? (numStr.split(".")[1]?.length ?? 1) : 0;
  const formatted = currentNum
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
      <div style={style}>
        {prefix}
        {formatted}
        {suffix}
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};
