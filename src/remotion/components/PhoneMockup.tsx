import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface PhoneMockupProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  accentColor = "#3B82F6",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const yOffset = interpolate(scaleProgress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scaleProgress}) translateY(${yOffset}px)`,
        opacity: scaleProgress,
      }}
    >
      <div
        style={{
          width: 375,
          height: 812,
          background: "#1A1A1A",
          borderRadius: 50,
          border: "4px solid #333",
          boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px #222, inset 0 0 0 1px #444`,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 160,
            height: 34,
            background: "#1A1A1A",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 10,
          }}
        />

        {/* Status Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 28px 0",
            height: 50,
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "SF Pro Display, system-ui, sans-serif",
            zIndex: 5,
            background: "transparent",
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {/* Signal bars */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#fff" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#fff" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#fff" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#fff" />
            </svg>
            {/* Battery */}
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="11"
                rx="2.5"
                stroke="#fff"
                strokeOpacity="0.35"
              />
              <rect
                x="2"
                y="2"
                width="18"
                height="8"
                rx="1.5"
                fill={accentColor}
              />
              <path
                d="M25 4v4a2 2 0 000-4z"
                fill="#fff"
                fillOpacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {children}
        </div>

        {/* Home Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 0 12px",
          }}
        >
          <div
            style={{
              width: 134,
              height: 5,
              borderRadius: 3,
              background: "#666",
            }}
          />
        </div>
      </div>
    </div>
  );
};
