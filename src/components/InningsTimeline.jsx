import React from "react";

export function InningsTimeline({ matchData }) {
  if (!matchData) return null;

  const { score, teams } = matchData;
  const teamName = score?.team || teams?.batting || teams?.teamA || "TEAM";

  const totalRuns = score?.runs ?? 0;
  const totalWickets = score?.wickets ?? 0;
  const overs = score?.overs ?? 0;
  const inningLabel = score?.inningLabel || "INNINGS";

  const wicketsData = [];
  if (score?.lastWicket) {
    wicketsData.push({
      num: `W${totalWickets || 1}`,
      score: Math.max(0, totalRuns - 5),
      player: score.lastWicket
    });
  }

  return (
    <div className="innings-timeline-container">
      <div className="timeline-header-row">
        <span className="timeline-title-text">{teamName} • {inningLabel} TIMELINE</span>
        {score?.partnership && (
          <span className="timeline-curr-partnership-text">PARTNERSHIP: <strong className="val-gold">{score.partnership}</strong></span>
        )}
      </div>

      <div className="timeline-graphic-track">
        {/* Continuous Horizontal Base Line */}
        <div className="timeline-base-line"></div>

        {/* Start Point (0) */}
        <div className="timeline-point start" style={{ left: "0%" }}>
          <span className="point-score-num">0</span>
          <div className="point-dot gray"></div>
          <span className="point-label-sub">Start</span>
        </div>

        {/* Wicket Points */}
        {wicketsData.map((w, idx) => {
          const denominator = totalRuns > 0 ? totalRuns : 1;
          const pct = Math.min(Math.max((w.score / denominator) * 82, 10), 82);
          return (
            <div key={idx} className="timeline-point wicket" style={{ left: `${pct}%` }}>
              <span className="point-score-num prominent">{w.score}</span>
              <div className="point-dot red"></div>
              <span className="point-label-sub red-txt">{w.num}</span>
              <span className="point-player-name-muted">{w.player}</span>
            </div>
          );
        })}

        {/* Current Score Marker (End) */}
        <div className="timeline-point current-end" style={{ left: "95%" }}>
          <span className="point-score-num giant-gold">{totalRuns}/{totalWickets}</span>
          <div className="point-dot gold-pulse-lg"></div>
          <span className="point-label-sub gold-txt-overs">{overs} ov</span>
        </div>
      </div>
    </div>
  );
}
