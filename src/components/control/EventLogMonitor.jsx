import React from "react";

export function EventLogMonitor({ events = [] }) {
  return (
    <div className="control-panel-section event-log-section">
      <div className="section-title-wrap">
        <h3>Event Log</h3>
      </div>
      <p className="section-desc">Live feed of remote OBS updates and WebSocket events.</p>

      <div className="event-log-list">
        {events.length === 0 ? (
          <div className="log-item empty">
            <span className="log-text muted">Listening for broadcast events…</span>
          </div>
        ) : (
          events.map((item) => (
            <div key={item.id} className="log-item">
              <span className="log-time">{item.time}</span>
              <span className="log-text">{item.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
