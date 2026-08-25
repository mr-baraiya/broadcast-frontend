import React from "react";

export function DashboardHeader({ liveCount = 0, upcomingCount = 0, connectionStatus, onRefresh, isRefreshing }) {
  const isConnected = connectionStatus === "connected";

  return (
    <header className="dash-console-header">
      <div className="console-brand-group">
        <div className="console-brand-text">
          <span className="brand-title">Cricket Production System</span>
          <span className="brand-subtitle">OBS Broadcast Command</span>
        </div>
      </div>

      <div className="console-meta-group">
        <div className="meta-pill live">
          <span className="pill-dot red" />
          <span>Live {liveCount}</span>
        </div>

        <div className="meta-pill upcoming">
          <span>Upcoming {upcomingCount}</span>
        </div>

        <div className={`meta-status-badge ${isConnected ? "connected" : ""}`}>
          <span>Feed: {isConnected ? "Connected" : "Reconnecting"}</span>
        </div>

        <button
          className={`btn-table-refresh ${isRefreshing ? "refreshing" : ""}`}
          onClick={onRefresh}
          aria-label="Refresh match list"
        >
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </header>
  );
}
