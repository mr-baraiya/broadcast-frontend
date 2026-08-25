import React from "react";

export function InningsTimeline({ matchData }) {
  if (!matchData) return null;

  const { score, teams } = matchData;
  const teamA = teams?.teamA || "SL";

  const totalRuns = score?.runs || 265;
  const totalWickets = score?.wickets || 8;
  const overs = score?.overs || 83.4;

  const wicketsData = [
    { num: "W1", score: 42, player: "Karunaratne 18" },
    { num: "W2", score: 98, player: "Mendis 34" },
    { num: "W3", score: 145, player: "Mathews 28" },
    { num: "W4", score: 182, player: "de Silva 45" },
    { num: "W5", score: 230, player: "Nuwantha 8" }
  ];

  return (
    <div className="innings-timeline-container">
      <div className="timeline-header-row">
        <span className="timeline-title-text">{teamA} • 1st INNINGS TIMELINE</span>
        <span className="timeline-curr-partnership-text">PARTNERSHIP: <strong className="val-gold">{score?.partnership || "35 (92)"}</strong></span>
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
          const pct = Math.min(Math.max((w.score / totalRuns) * 82, 10), 82);
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
