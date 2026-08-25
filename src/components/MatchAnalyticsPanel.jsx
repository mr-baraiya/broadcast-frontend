import React from "react";

export function MatchAnalyticsPanel({ matchData }) {
  if (!matchData) return null;

  const { score, teams } = matchData;
  const teamA = teams?.teamA || "SL";
  const rawInningNum = score?.inningNumber || 1;
  const inningStr = rawInningNum === 1 ? "1st INNINGS" : `${rawInningNum}nd INNINGS`;

  return (
    <div className="match-analytics-glass-panel">
      <div className="analytics-header">
        <span className="analytics-title">MATCH ANALYTICS & CONTEXT</span>
        <span className="analytics-subtitle-prominent">{teamA} • {inningStr}</span>
      </div>

      {/* 3 Metric Columns */}
      <div className="analytics-metrics-grid">
        <div className="metric-box">
          <span className="metric-lbl">SESSION SCORE</span>
          <span className="metric-val">35 runs</span>
          <span className="metric-sub">92 balls</span>
        </div>

        <div className="metric-box">
          <span className="metric-lbl">PARTNERSHIP</span>
          <span className="metric-val">{score?.partnership || "35 (92)"}</span>
          <span className="metric-sub yellow">CURRENT</span>
        </div>

        <div className="metric-box">
          <span className="metric-lbl">INNINGS PROGRESSION</span>
          <span className="metric-val">{score?.runs || 265}/{score?.wickets || 8}</span>
          <span className="metric-sub">{score?.overs || 83.4} ov</span>
        </div>
      </div>
    </div>
  );
}
