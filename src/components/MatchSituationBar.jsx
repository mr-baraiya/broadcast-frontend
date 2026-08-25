import React from "react";
import { formatRunRate } from "../utils/formatScore";

export function MatchSituationBar({ matchData }) {
  if (!matchData) return null;

  const { score, winProbability, sessionInfo } = matchData;
  const prob = winProbability || { teamA: "2%", draw: "20%", teamB: "78%" };
  const sess = sessionInfo || { session: "Day 3 - Session 2", oversLeftToday: "57.4" };

  return (
    <div className="ref-situation-container">
      {/* Row 1: CRR, Partnership, Win Probability & Trail Status */}
      <div className="ref-sit-row-1">
        <div className="ref-pill red-pill">
          <span className="pill-lbl">CRR:</span>
          <span className="pill-val">{formatRunRate(score?.crr)}</span>
        </div>

        {score?.partnership && (
          <div className="ref-pill red-pill">
            <span className="pill-lbl">P'SHIP:</span>
            <span className="pill-val">{score.partnership}</span>
          </div>
        )}

        <div className="ref-prob-bar">
          <span className="prob-segment team-a">SL {prob.teamA}</span>
          <span className="prob-segment team-b">IND {prob.teamB}</span>
        </div>

        <div className="ref-blue-trail-panel">
          {score?.trailBy || "SL trail by 238 runs"}
        </div>
      </div>

      {/* Row 2: Day/Session, Probability Pills, Overs Left */}
      <div className="ref-sit-row-2">
        <div className="ref-pill pink-pill">
          {sess.session}
        </div>

        <div className="ref-yellow-prob-group">
          <span className="yellow-chip">SL: {prob.teamA}</span>
          <span className="yellow-chip">DRAW: {prob.draw}</span>
          <span className="yellow-chip">IND: {prob.teamB}</span>
        </div>

        {sess.oversLeftToday && (
          <div className="ref-pill cyan-pill">
            Overs left today: {sess.oversLeftToday}
          </div>
        )}
      </div>

      {/* Row 3: Next Batsman & Last Wicket */}
      <div className="ref-sit-row-3">
        <div className="ref-pill blue-info-pill">
          <span className="pill-lbl">Next Batsman:</span>
          <span className="pill-val">{score?.nextBatsman || "N Dickwella"}</span>
        </div>

        <div className="ref-pill blue-info-pill right">
          <span className="pill-lbl">Last Wkt:</span>
          <span className="pill-val">{score?.lastWicket || "D de Silva 8 (14)"}</span>
        </div>
      </div>
    </div>
  );
}
