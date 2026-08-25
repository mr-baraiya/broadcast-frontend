import React from "react";
import { buildBroadcastTickerSegments } from "../../utils/tickerBuilder";

export function BroadcastTicker({ matchData }) {
  const segments = buildBroadcastTickerSegments(matchData);

  if (!segments || segments.length === 0) return null;

  const doubleSegments = [...segments, ...segments, ...segments];

  return (
    <div className="dark-context-ticker-bar">
      <div className="ticker-live-badge-fixed">
        <span className="live-red-dot">●</span>
        <span className="live-txt">LIVE</span>
      </div>

      <div className="ticker-track-smooth">
        {doubleSegments.map((item, idx) => (
          <div key={`${item.id}_${idx}`} className="context-ticker-item">
            <span className="ticker-val-yellow">{item.value}</span>
            <span className="ticker-sep-bullet">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
