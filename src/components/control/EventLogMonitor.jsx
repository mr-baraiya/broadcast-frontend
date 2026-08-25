import React from "react";
import { Activity, Clock } from "lucide-react";

export function EventLogMonitor({ events = [] }) {
  const defaultLogs = [
    { id: 1, time: "Just now", label: "Broadcast state synchronized with OBS", type: "sync" },
    { id: 2, time: "10s ago", label: "Score updated: SRI LANKA 265/8 (83.4 ov)", type: "score" },
    { id: 3, time: "25s ago", label: "WebSocket connection verified OK", type: "system" }
  ];

  const logs = events.length > 0 ? events : defaultLogs;

  return (
    <div className="control-panel-section event-log-section">
      <div className="section-title-wrap">
        <h3>LIVE EVENT & CONNECTION MONITOR</h3>
      </div>
      <p className="section-desc">Real-time log feed tracking remote OBS updates and backend WebSocket events.</p>

      <div className="event-log-list">
        {logs.map((item) => (
          <div key={item.id} className="log-item">
            <span className="log-time">
              <Clock size={12} />
              <span>{item.time}</span>
            </span>
            <span className="log-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
