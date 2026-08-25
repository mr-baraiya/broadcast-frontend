import React from "react";
import { Activity, Radio, MonitorPlay } from "lucide-react";

export function DashboardHero({ liveCount = 0, upcomingCount = 0 }) {
  return (
    <section className="dashboard-hero">
      <div className="hero-content">
        <div className="hero-tag">
          <Activity size={16} />
          <span>PRODUCTION CONTROL DASHBOARD</span>
        </div>
        <h1 className="hero-title">Live Cricket Broadcasts</h1>
        <p className="hero-description">
          Monitor active live matches, launch 16:9 OBS graphics overlays, and control broadcast overlays in real-time.
        </p>
      </div>

      <div className="hero-stats">
        <div className="stat-box live">
          <Radio size={20} className="stat-icon" />
          <div>
            <div className="stat-value">{liveCount}</div>
            <div className="stat-label">Live Now</div>
          </div>
        </div>

        <div className="stat-box">
          <MonitorPlay size={20} className="stat-icon" />
          <div>
            <div className="stat-value">{upcomingCount}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
      </div>
    </section>
  );
}
