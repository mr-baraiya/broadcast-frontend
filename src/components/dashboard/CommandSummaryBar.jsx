import React from "react";

export function CommandSummaryBar({ liveCount = 0, upcomingCount = 0, isConnected = true }) {
  return (
    <div className="command-summary-bar">
      <div className="summary-stat-card live">
        <span className="stat-num">{liveCount}</span>
        <span className="stat-label">LIVE MATCHES</span>
      </div>

      <div className="summary-stat-card gold">
        <span className="stat-num">{liveCount}</span>
        <span className="stat-label">BROADCAST READY</span>
      </div>

      <div className="summary-stat-card cyan">
        <span className="stat-num">{upcomingCount}</span>
        <span className="stat-label">UPCOMING</span>
      </div>

      <div className="summary-stat-card green">
        <span className="stat-num">{isConnected ? "ONLINE" : "OFFLINE"}</span>
        <span className="stat-label">BACKEND FEED</span>
      </div>
    </div>
  );
}
