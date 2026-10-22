import React from "react";

export const DraftWatermark: React.FC<{text: string; note: string}> = ({
  text,
  note,
}) => {
  return (
    <>
      {/* Upper-right safe area watermark */}
      <div
        style={{
          position: "absolute",
          top: 64,
          right: 64,
          zIndex: 100,
          background: "rgba(220, 38, 38, 0.18)",
          border: "1px solid rgba(239, 68, 68, 0.45)",
          color: "#fca5a5",
          padding: "8px 18px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textTransform: "uppercase",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)",
          pointerEvents: "none",
        }}
      >
        {text}
      </div>

      {/* Scientific disclaimer label */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: 64,
          zIndex: 100,
          color: "rgba(148, 163, 184, 0.75)",
          fontSize: 13,
          letterSpacing: 0.8,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          pointerEvents: "none",
        }}
      >
        {note}
      </div>
    </>
  );
};
