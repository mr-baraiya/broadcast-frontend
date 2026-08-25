import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Wifi, WifiOff, Activity } from "lucide-react";

export function ControlHeader({ matchTitle, matchId, connectionStatus }) {
  const isConnected = connectionStatus === "connected";

  return (
    <header className="control-header">
      <div className="control-header-left">
        <Link to="/" className="btn-back">
          <ArrowLeft size={14} />
          <span>Dashboard</span>
        </Link>

        <div className="control-title-wrap">
          <h1 className="control-title">{matchTitle || `Match ${matchId}`}</h1>
          <span className="live-status-chip">● LIVE</span>
          <span className="match-id-badge">ID: {matchId}</span>
        </div>
      </div>

      <div className="control-header-right">
        <div className={`status-badge ${isConnected ? "connected" : "reconnecting"}`}>
          {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>FEED: {isConnected ? "CONNECTED" : "RECONNECTING"}</span>
        </div>

        <div className="status-badge sync">
          <Activity size={13} />
          <span>OBS SYNC: ACTIVE</span>
        </div>
      </div>
    </header>
  );
}
