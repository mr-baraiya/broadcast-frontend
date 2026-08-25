import React from "react";
import { buildBroadcastTickerSegments } from "../../utils/tickerBuilder";

export function BroadcastTicker({ matchData }) {
  const segments = buildBroadcastTickerSegments(matchData);

  if (!segments || segments.length === 0) return null;

  const doubleSegments = [...segments, ...segments];

  return (
    <div className="ref-bottom-ticker-bar">
      <div className="ticker-track">
        {doubleSegments.map((item, idx) => (
          <div key={`${item.id}_${idx}`} className="ref-ticker-item">
            <span className="ref-ticker-badge">{item.badge}:</span>
            <span className="ref-ticker-val">{item.value}</span>
            <span className="ref-ticker-sep">-</span>
          </div>
        ))}
      </div>
    </div>
  );
}
