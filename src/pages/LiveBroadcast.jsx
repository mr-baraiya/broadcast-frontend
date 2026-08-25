import React from "react";
import { useParams } from "react-router-dom";
import { useMatch } from "../hooks/useMatch";
import { useBroadcastEvents } from "../hooks/useBroadcastEvents";
import { BroadcastLayout } from "../components/BroadcastLayout";

export function LiveBroadcast() {
  const { matchId } = useParams();
  const targetId = matchId || "163017";

  const { matchData, controlState, isLoading, error, connectionStatus, animations } = useMatch(targetId);
  const { activeEvent } = useBroadcastEvents(matchData);

  if (isLoading && !matchData) {
    return (
      <div className="broadcast-root" style={{ color: "#facc15", fontSize: "1.4rem", fontWeight: 800 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(250, 204, 21, 0.2)",
            borderTopColor: "#facc15",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          LOADING BROADCAST STREAM ({targetId})...
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error && !matchData) {
    return (
      <div className="broadcast-root" style={{ color: "#f87171", fontSize: "1.2rem", fontWeight: 700 }}>
        <div>
          <div>DATA CONNECTION ERROR: {error}</div>
          <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "0.5rem" }}>
            Check backend server at VITE_API_BASE_URL.
          </div>
        </div>
      </div>
    );
  }

  return (
    <BroadcastLayout
      matchData={matchData}
      connectionStatus={connectionStatus}
      animations={animations}
      controlState={controlState}
      activeEvent={activeEvent}
    />
  );
}
