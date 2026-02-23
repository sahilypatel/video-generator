import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

interface BrowserMockupProps {
  url?: string;
  children: React.ReactNode;
  accentColor?: string;
  showAddressBar?: boolean;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  url = "https://example.com",
  children,
  accentColor = "#3B82F6",
  showAddressBar = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3)",
        transform: `scale(${scaleProgress})`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "#1E1E1E",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ display: "flex", gap: 7, marginRight: 8 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((color) => (
            <div
              key={color}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>

        {showAddressBar && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "#2D2D2D",
              borderRadius: 6,
              padding: "6px 12px",
              border: `1px solid ${accentColor}22`,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: 8, flexShrink: 0 }}
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill="#888"
              />
            </svg>
            <span
              style={{
                color: "#999",
                fontSize: 13,
                fontFamily: "SF Mono, Menlo, monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {url}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          background: "#111",
          flex: 1,
          minHeight: 200,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
