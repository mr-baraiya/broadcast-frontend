import React from "react";
import { Link } from "react-router-dom";
import { formatRunsWickets, formatOvers, formatRunRate } from "../../utils/formatScore";
import { getTeamInitials } from "../../utils/teamLogos";

import { resolveVenue } from "../../utils/venueResolver";

export function LiveMatchCard({ match }) {
  if (!match) return null;

  const matchId = match.id || "163017";
  const title = match.title || "Cricket Match";
  const venue = resolveVenue(match);
  const statusText = match.status_text || match.status || "LIVE";

  const teams = Array.isArray(match.teams) ? match.teams : ["TEAM A", "TEAM B"];
  const teamA = teams[0] || "TEAM A";
  const teamB = teams[1] || "TEAM B";

  const initialsA = getTeamInitials(teamA);
  const initialsB = getTeamInitials(teamB);

  const score = match.score || {};
  const battingTeamStr = (score.team || "").toLowerCase().trim();
  const teamALower = teamA.toLowerCase().trim();
  const isTeamABatting = battingTeamStr.includes(teamALower) || battingTeamStr === teamALower;

  const scoreA = isTeamABatting && score.runs !== undefined && score.runs !== null
    ? formatRunsWickets(score.runs, score.wickets)
    : "Yet to bat";
  const oversA = isTeamABatting && score.overs !== undefined && score.overs !== null
    ? formatOvers(score.overs)
    : "";

  const scoreB = !isTeamABatting && score.runs !== undefined && score.runs !== null
    ? formatRunsWickets(score.runs, score.wickets)
    : "Yet to bat";
  const oversB = !isTeamABatting && score.overs !== undefined && score.overs !== null
    ? formatOvers(score.overs)
    : "";

  const formatTitle = title.split(",")[1]?.trim() || "Match";

  return (
    <div className="card-broadcast-match live-card">
      <div className="card-top-bar">
        <div className="card-live-chip">
          <span className="pill-dot red" />
          <span>Live</span>
        </div>
        <span className="card-format-tag">{formatTitle}</span>
      </div>

      <div className="card-teams-scores">
        <div className={`card-team-row ${isTeamABatting ? "batting" : ""}`}>
          <div className="team-name-group">
            <span className="team-shield-badge">{initialsA}</span>
            <span className="team-name">{teamA}</span>
          </div>
          <div className="team-score-group">
            <span className="score-main">{scoreA}</span>
            {oversA && <span className="overs-sub">{oversA}</span>}
          </div>
        </div>

        <div className={`card-team-row ${!isTeamABatting ? "batting" : ""}`}>
          <div className="team-name-group">
            <span className="team-shield-badge">{initialsB}</span>
            <span className="team-name">{teamB}</span>
          </div>
          <div className="team-score-group">
            <span className="score-main">{scoreB}</span>
            {oversB && <span className="overs-sub">{oversB}</span>}
          </div>
        </div>
      </div>

      <div className="card-insights-row">
        {score.run_rate && (
          <span className="insight-chip">CRR {formatRunRate(score.run_rate)}</span>
        )}
        {score.partnership && (
          <span className="insight-chip">P {score.partnership}</span>
        )}
        <div className="situation-line">{statusText}</div>
      </div>

      <div className="card-footer-bar">
        <span className="venue-name">{venue}</span>
        <div className="card-actions-flex">
          <Link to={`/live/${matchId}`} className="btn-card-action live">
            Overlay
          </Link>
          <Link to={`/control/${matchId}`} className="btn-card-action control">
            Control
          </Link>
        </div>
      </div>
    </div>
  );
}
