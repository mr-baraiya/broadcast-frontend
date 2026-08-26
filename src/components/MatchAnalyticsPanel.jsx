import React from "react";

export function MatchAnalyticsPanel({ matchData }) {
  if (!matchData) return null;

  const { score, teams } = matchData;
  const teamName = score?.team || teams?.batting || teams?.teamA || "TEAM";
  const inningStr = score?.inningLabel || "1st INNINGS";

  const totalRuns = score?.runs ?? 0;
  const totalWickets = score?.wickets ?? 0;
  const overs = score?.overs ?? 0;
  const partnershipStr = score?.partnership || "N/A";

  return (
    <div className="match-analytics-glass-panel">
      <div className="analytics-header">
        <span className="analytics-title">MATCH ANALYTICS & CONTEXT</span>
        <span className="analytics-subtitle-prominent">{teamName} • {inningStr}</span>
      </div>

      {/* 3 Metric Columns */}
      <div className="analytics-metrics-grid">
        <div className="metric-box">
          <span className="metric-lbl">MATCH STATUS</span>
          <span className="metric-val">{score?.trailBy || matchData.statusText || "IN PROGRESS"}</span>
          <span className="metric-sub">{score?.crr ? `CRR: ${score.crr}` : ""}</span>
        </div>

        <div className="metric-box">
          <span className="metric-lbl">PARTNERSHIP</span>
          <span className="metric-val">{partnershipStr}</span>
          <span className="metric-sub yellow">CURRENT</span>
        </div>

        <div className="metric-box">
          <span className="metric-lbl">INNINGS PROGRESSION</span>
          <span className="metric-val">{totalRuns}/{totalWickets}</span>
          <span className="metric-sub">{overs} ov</span>
        </div>
      </div>
    </div>
  );
}
