import React from "react";

export function ConnectionIndicator({ status = "connected", dataStatus = "fresh" }) {
  const isLive = status === "connected" && dataStatus === "fresh";
  const isStale = status === "connected" && dataStatus === "stale";

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      fontSize: "0.75rem",
      fontWeight: 800,
      letterSpacing: "0.8px",
      color: isLive ? "#4ade80" : isStale ? "#facc15" : "#f87171",
      boxShadow: isLive ? "0 0 10px rgba(74, 222, 128, 0.3)" : "none"
    }}>
      <span style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: isLive ? "#4ade80" : isStale ? "#facc15" : "#f87171",
        boxShadow: isLive ? "0 0 8px #4ade80" : "none"
      }} />
      {isLive ? "LIVE DATA" : isStale ? "STALE DATA" : "RECONNECTING"}
    </div>
  );
}
