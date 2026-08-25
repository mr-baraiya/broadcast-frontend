import React from "react";

export function CommentaryTicker({ latestEvent }) {
  if (!latestEvent || !latestEvent.text) {
    return (
      <div className="commentary-ticker-bar">
        <div className="ticker-label">LIVE FEED</div>
        <div className="ticker-text" style={{ color: "#94a3b8" }}>
          Waiting for live commentary delivery...
        </div>
      </div>
    );
  }

  const label = latestEvent.event ? `LAST BALL: ${latestEvent.event}` : "LAST BALL";

  return (
    <div className="commentary-ticker-bar">
      <div className="ticker-label">{label}</div>
      <div className="ticker-text animate-commentary" key={latestEvent.event_id || latestEvent.text}>
        {latestEvent.text}
      </div>
    </div>
  );
}
