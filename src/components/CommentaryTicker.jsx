import React from "react";

export function CommentaryTicker({ matchData, latestEvent }) {
  const lastBall = matchData?.lastBall || null;

  const label = lastBall?.label || (latestEvent?.event ? `LAST BALL: ${latestEvent.event}` : "LAST BALL");
  const text = lastBall?.text || latestEvent?.text || latestEvent?.commentary || "Waiting for live commentary delivery...";
  const badgeType = lastBall?.badge || "DOT";

  return (
    <div className="commentary-ticker-bar">
      <div className={`ticker-label badge-${badgeType.toLowerCase()}`}>{label}</div>
      <div className="ticker-text animate-commentary" key={text}>
        {text}
      </div>
    </div>
  );
}
