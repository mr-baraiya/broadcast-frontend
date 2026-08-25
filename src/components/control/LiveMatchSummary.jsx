import React from "react";
import { formatRunsWickets, formatOvers, formatRunRate } from "../../utils/formatScore";

export function LiveMatchSummary({ matchData }) {
  if (!matchData) return null;

  const { teams, score, latestEvent, statusText } = matchData;
  const teamA = teams?.teamA || "TEAM A";
  const teamB = teams?.teamB || "TEAM B";
  const battingTeam = score?.team || teamA;

  const formattedScore = score?.runs !== undefined && score?.runs !== null
    ? formatRunsWickets(score.runs, score.wickets)
    : "Yet to bat";
  const formattedOvers = score?.overs !== undefined && score?.overs !== null
    ? formatOvers(score.overs)
    : "";

  return (
    <div className="operator-summary-bar">
      <div className="summary-col team-score-col">
        <span className="summary-label">LIVE MATCH</span>
        <div className="summary-score-value">
          <span className="team-highlight">{battingTeam}</span>
          <span className="score-digits">{formattedScore}</span>
          <span className="overs-text">{formattedOvers}</span>
        </div>
      </div>

      <div className="summary-col">
        <span className="summary-label">RUN RATE</span>
        <span className="summary-val">{formatRunRate(score?.crr)}</span>
      </div>

      {score?.partnership && (
        <div className="summary-col">
          <span className="summary-label">PARTNERSHIP</span>
          <span className="summary-val">{score.partnership}</span>
        </div>
      )}

      <div className="summary-col situation-col">
        <span className="summary-label">SITUATION</span>
        <span className="summary-val status">{statusText || "Match in Progress"}</span>
      </div>

      {latestEvent?.text && (
        <div className="summary-col commentary-col">
          <span className="summary-label">LAST BALL</span>
          <span className="summary-val comm-text">{latestEvent.text}</span>
        </div>
      )}
    </div>
  );
}
