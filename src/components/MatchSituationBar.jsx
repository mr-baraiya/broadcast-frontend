import React from "react";
import { formatRunRate } from "../utils/formatScore";

export function MatchSituationBar({ matchData }) {
  if (!matchData) return null;

  const { score, winProbability, sessionInfo, teams } = matchData;
  const teamA = teams?.teamA || "TEAM A";
  const teamB = teams?.teamB || "TEAM B";

  const hasRow1 = !!(score?.crr || score?.partnership || score?.trailBy || winProbability);
  const hasRow2 = !!(sessionInfo?.session || winProbability || sessionInfo?.oversLeftToday);
  const hasRow3 = !!(score?.nextBatsman || score?.lastWicket);

  if (!hasRow1 && !hasRow2 && !hasRow3) return null;

  return (
    <div className="ref-situation-container">
      {/* Row 1: CRR, Partnership, Win Probability & Trail Status */}
      {hasRow1 && (
        <div className="ref-sit-row-1">
          {score?.crr && (
            <div className="ref-pill red-pill">
              <span className="pill-lbl">CRR:</span>
              <span className="pill-val">{formatRunRate(score.crr)}</span>
            </div>
          )}

          {score?.partnership && (
            <div className="ref-pill red-pill">
              <span className="pill-lbl">P'SHIP:</span>
              <span className="pill-val">{score.partnership}</span>
            </div>
          )}

          {winProbability && (
            <div className="ref-prob-bar">
              {winProbability.teamA && <span className="prob-segment team-a">{teamA} {winProbability.teamA}</span>}
              {winProbability.teamB && <span className="prob-segment team-b">{teamB} {winProbability.teamB}</span>}
            </div>
          )}

          {score?.trailBy && (
            <div className="ref-blue-trail-panel">
              {score.trailBy}
            </div>
          )}
        </div>
      )}

      {/* Row 2: Day/Session, Probability Pills, Overs Left */}
      {hasRow2 && (
        <div className="ref-sit-row-2">
          {sessionInfo?.session && (
            <div className="ref-pill pink-pill">
              {sessionInfo.session}
            </div>
          )}

          {winProbability && (
            <div className="ref-yellow-prob-group">
              {winProbability.teamA && <span className="yellow-chip">{teamA}: {winProbability.teamA}</span>}
              {winProbability.draw && <span className="yellow-chip">DRAW: {winProbability.draw}</span>}
              {winProbability.teamB && <span className="yellow-chip">{teamB}: {winProbability.teamB}</span>}
            </div>
          )}

          {sessionInfo?.oversLeftToday && (
            <div className="ref-pill cyan-pill">
              Overs left today: {sessionInfo.oversLeftToday}
            </div>
          )}
        </div>
      )}

      {/* Row 3: Next Batsman & Last Wicket */}
      {hasRow3 && (
        <div className="ref-sit-row-3">
          {score?.nextBatsman && (
            <div className="ref-pill blue-info-pill">
              <span className="pill-lbl">Next Batsman:</span>
              <span className="pill-val">{score.nextBatsman}</span>
            </div>
          )}

          {score?.lastWicket && (
            <div className="ref-pill blue-info-pill right">
              <span className="pill-lbl">Last Wkt:</span>
              <span className="pill-val">{score.lastWicket}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
