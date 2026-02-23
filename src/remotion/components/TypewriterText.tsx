import React from "react";
import { useCurrentFrame } from "remotion";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  /** Frames per character */
  speed?: number;
  showCursor?: boolean;
  cursorColor?: string;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  speed = 2,
  showCursor = true,
  cursorColor = "white",
  style,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);
  const charsToShow = Math.min(Math.floor(adjustedFrame / speed), text.length);
  const visibleText = text.slice(0, charsToShow);
  const isDone = charsToShow >= text.length;
  const cursorVisible =
    showCursor && (isDone ? Math.floor(frame / 15) % 2 === 0 : true);

  return (
    <span style={{ ...style, display: "inline" }}>
      {visibleText}
      {cursorVisible && (
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: "0.85em",
            background: cursorColor,
            marginLeft: 3,
            verticalAlign: "text-bottom",
            borderRadius: 1,
          }}
        />
      )}
    </span>
  );
};
