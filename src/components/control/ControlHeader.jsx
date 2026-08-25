import React from "react";
import { Link } from "react-router-dom";

export function ControlHeader({ matchTitle, matchId, connectionStatus }) {
  const isConnected = connectionStatus === "connected";

  return (
    <header className="control-header">
      <div className="control-header-left">
        <Link to="/" className="btn-back">← Dashboard</Link>

        <div className="control-title-wrap">
          <h1 className="control-title">{matchTitle || `Match ${matchId}`}</h1>
          <span className="live-status-chip">● LIVE</span>
          <span className="match-id-badge">#{matchId}</span>
        </div>
      </div>

      <div className="control-header-right">
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
