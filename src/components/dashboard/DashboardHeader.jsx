import React from "react";
import { Radio, Wifi, WifiOff, RefreshCw } from "lucide-react";

export function DashboardHeader({ liveCount = 0, upcomingCount = 0, connectionStatus, onRefresh, isRefreshing }) {
  const isConnected = connectionStatus === "connected";

  return (
    <header className="dash-console-header">
      <div className="console-brand-group">
        <Radio size={18} className="brand-icon live" />
        <div className="console-brand-text">
          <span className="brand-title">CRICKET PRODUCTION SYSTEM</span>
          <span className="brand-subtitle">OBS BROADCAST COMMAND</span>
        </div>
      </div>

      <div className="console-meta-group">
        <div className="meta-pill live">
          <span className="pill-dot red" />
          <span className="pill-text">LIVE {liveCount}</span>
        </div>

        <div className="meta-pill upcoming">
          <span className="pill-text">UPCOMING {upcomingCount}</span>
        </div>

        <div className={`meta-status-badge ${isConnected ? "connected" : "reconnecting"}`}>
          {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
          <span>FEED: {isConnected ? "CONNECTED" : "RECONNECTING"}</span>
        </div>

        <button className="btn-table-refresh" onClick={onRefresh} aria-label="Refresh match list" title="Refresh data">
          <RefreshCw size={13} className={isRefreshing ? "spin-icon" : ""} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
}
