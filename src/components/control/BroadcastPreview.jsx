import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Maximize } from "lucide-react";
import { formatRunsWickets, formatOvers } from "../../utils/formatScore";

export function BroadcastPreview({ matchData, controlState, matchId }) {
  if (!matchData) return null;

  const { teams, score } = matchData;
  const teamA = teams.teamA || "TEAM A";
  const teamB = teams.teamB || "TEAM B";
  const formattedScore = formatRunsWickets(score.runs, score.wickets);
  const formattedOvers = formatOvers(score.overs);

  return (
    <div className="control-panel-section preview-section">
      <div className="section-title-wrap preview-title-row">
        <h3>OBS BROADCAST PREVIEW</h3>
        <div className="preview-action-group">
          <Link to={`/live/${matchId}`} target="_blank" className="btn-icon-link" aria-label="Open broadcast in new tab" title="Open in new tab">
            <ExternalLink size={13} />
          </Link>
          <Link to={`/live/${matchId}`} target="_blank" className="btn-icon-link" aria-label="Fullscreen broadcast preview" title="Fullscreen">
            <Maximize size={13} />
          </Link>
        </div>
      </div>
      <p className="section-desc">Live 16:9 monitor canvas reflecting current OBS output.</p>

      <div className="preview-canvas-box">
        <div className="preview-header-bar">
          <span className="preview-tag">● OBS CANVAS (1920x1080)</span>
          <span className="preview-layout-tag">LAYOUT: {controlState.layout || "DEFAULT"}</span>
        </div>

        <div className="preview-overlay-content">
          {controlState.showScoreboard ? (
            <div className="preview-scoreboard-panel">
              <div className="preview-team">
                <span className="preview-badge">{teamA.substring(0, 3)}</span>
                <span className="preview-name">{teamA}</span>
              </div>

              <div className="preview-score-center">
                <span className="preview-digits">{formattedScore}</span>
                <span className="preview-overs">{formattedOvers}</span>
              </div>

              <div className="preview-team right">
                <span className="preview-name">{teamB}</span>
                <span className="preview-badge">{teamB.substring(0, 3)}</span>
              </div>
            </div>
          ) : (
            <div className="preview-disabled-pill">
              Scoreboard Hidden
            </div>
          )}

          <div className="preview-active-toggles-list">
            <span className={`toggle-chip ${controlState.showPlayers ? "on" : "off"}`}>
              Players
            </span>
            <span className={`toggle-chip ${controlState.showRecentBalls ? "on" : "off"}`}>
              Recent Balls
            </span>
            <span className={`toggle-chip ${controlState.showCommentary ? "on" : "off"}`}>
              Commentary
            </span>
            <span className={`toggle-chip ${controlState.showVenue ? "on" : "off"}`}>
              Venue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
