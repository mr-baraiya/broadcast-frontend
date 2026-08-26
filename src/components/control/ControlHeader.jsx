import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export function ControlHeader({ matchTitle, matchId, connectionStatus }) {
  const isConnected = connectionStatus === "connected";

  return (
    <header className="control-header">
      <div className="control-header-left" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/" className="btn-back">← Dashboard</Link>

        <img src="/logo.png" alt="App Logo" style={{ height: "30px", width: "auto", objectFit: "contain" }} />



        <div className="control-title-wrap">
          <h1 className="control-title">{matchTitle || `Match ${matchId}`}</h1>
          <span className="live-status-chip">● LIVE</span>
          <span className="match-id-badge">#{matchId}</span>
        </div>
      </div>

      <div className="control-header-right" style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
        <Link
          to="/instructions"
          target="_blank"
          className="btn-back"
          style={{
            color: "#f0a500",
            borderColor: "rgba(240, 165, 0, 0.4)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            textDecoration: "none"
          }}
          title="Open Operator Instructions Guide"
        >
          <BookOpen size={13} color="#f0a500" />
          <span>Operator Guide</span>
        </Link>

        <div className={`status-badge ${isConnected ? "connected" : "reconnecting"}`}>
          Feed: {isConnected ? "Connected" : "Reconnecting"}
        </div>
        <div className="status-badge sync">
          OBS Sync: Active
        </div>
      </div>
    </header>
  );
}

