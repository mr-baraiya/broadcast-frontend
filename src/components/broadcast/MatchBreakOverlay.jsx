import React from "react";
import { formatRunsWickets, formatOvers } from "../../utils/formatScore";
import { BREAK_SUBTYPES, MATCH_STATE_TYPES } from "../../utils/matchState";
import { CloudRain, Coffee, Utensils, PauseCircle, Clock, Trophy, CheckCircle2 } from "lucide-react";
import "../../styles/broadcastStateOverlays.css";

export function MatchBreakOverlay({ matchData, stateInfo }) {
  if (!matchData) return null;

  const { score, teams } = matchData;
  const isCompleted = stateInfo?.type === MATCH_STATE_TYPES.COMPLETED || (matchData.status || "").toUpperCase() === "COMPLETED";

  const breakType = stateInfo?.breakType || BREAK_SUBTYPES.GENERAL;
  const badgeTitle = isCompleted ? "MATCH COMPLETED" : (stateInfo?.title || "MATCH BREAK");
  const statusMsg = stateInfo?.statusText || matchData?.statusText || (isCompleted ? "Match Concluded" : "Play suspended temporarily");

  const battingTeam = score?.team || teams?.batting || teams?.teamA || "TEAM A";
  const bowlingTeam = teams?.bowling || teams?.teamB || "TEAM B";

  // Score calculations
  const runsStr = score?.runs !== undefined && score?.runs !== null ? formatRunsWickets(score.runs, score.wickets) : "N/A";
  const oversStr = score?.overs !== undefined ? formatOvers(score.overs) : "";

  // Target / Equation calculations
  const target = score?.target || matchData.target || (score?.runs ? score.runs + 1 : null);
  const rrr = score?.rrr || matchData.rrr;
  const trailBy = score?.trailBy || matchData.trail_by;

  // Icon mapping by break subtype
  const renderBreakIcon = () => {
    if (isCompleted) return <CheckCircle2 size={20} className="break-icon" style={{ color: "#4ade80" }} />;
    switch (breakType) {
      case BREAK_SUBTYPES.RAIN_DELAY:
        return <CloudRain size={20} className="break-icon" />;
      case BREAK_SUBTYPES.TEA:
        return <Coffee size={20} className="break-icon" />;
      case BREAK_SUBTYPES.LUNCH:
        return <Utensils size={20} className="break-icon" />;
      case BREAK_SUBTYPES.TIMEOUT:
      case BREAK_SUBTYPES.DRINKS:
        return <Clock size={20} className="break-icon" />;
      default:
        return <PauseCircle size={20} className="break-icon" />;
    }
  };

  const isRain = breakType === BREAK_SUBTYPES.RAIN_DELAY;
  const isInningsBreak = breakType === BREAK_SUBTYPES.INNINGS_BREAK;

  return (
    <div className="state-overlay-container">
      <div className={`break-overlay-stage ${isCompleted ? "completed-stage" : isRain ? "rain-delay" : isInningsBreak ? "innings-break" : ""}`}>
        {/* Top Break Badge */}
        <div className={`break-header-badge ${isCompleted ? "completed-badge" : isRain ? "rain-delay" : isInningsBreak ? "innings-break" : "general"}`} style={isCompleted ? { background: "rgba(34, 197, 94, 0.2)", borderColor: "rgba(34, 197, 94, 0.5)", color: "#4ade80" } : {}}>
          {renderBreakIcon()}
          <span>{badgeTitle}</span>
        </div>

        {/* Main Grid: Innings Score & Result Equation */}
        <div className="break-main-grid">
          {/* Innings Score Card */}
          <div className="break-score-card">
            <span className="break-score-lbl">{isCompleted ? "FINAL SCORE" : "1ST INNINGS SCORE"} — {battingTeam}</span>
            <div className="break-score-val">{runsStr}</div>
            {oversStr && <div className="break-overs-val">({oversStr} Overs)</div>}
          </div>

          {/* Result / Match Equation Card */}
          <div className="break-equation-card">
            <span className="break-eq-title">{isCompleted ? "MATCH RESULT" : "MATCH EQUATION"}</span>
            {isCompleted ? (
              <div className="break-eq-target" style={{ color: "#facc15", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Trophy size={20} color="#facc15" />
                <span>{statusMsg}</span>
              </div>
            ) : target ? (
              <div className="break-eq-target">
                {bowlingTeam} Target: <strong style={{ color: "#facc15" }}>{target} RUNS</strong>
              </div>
            ) : trailBy ? (
              <div className="break-eq-target">{trailBy}</div>
            ) : (
              <div className="break-eq-target">2nd Innings Target: {score?.runs ? score.runs + 1 : "TBD"}</div>
            )}

            {!isCompleted && rrr && (
              <div className="break-eq-rrr">
                Required Run Rate: <strong style={{ color: "#38bdf8" }}>{rrr} RPO</strong>
              </div>
            )}
          </div>
        </div>

        {/* Status Description Banner */}
        <div className="break-status-text-banner">
          {isCompleted ? <Trophy size={18} color="#facc15" /> : <Clock size={18} color="#facc15" />}
          <span>{statusMsg}</span>
        </div>
      </div>
    </div>
  );
}
