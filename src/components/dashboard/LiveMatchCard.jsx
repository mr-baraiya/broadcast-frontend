import React from "react";
import { Link } from "react-router-dom";
import { MonitorPlay, SlidersHorizontal, MapPin } from "lucide-react";
import { formatRunsWickets, formatOvers, formatRunRate } from "../../utils/formatScore";
import { getTeamInitials } from "../../utils/teamLogos";

export function LiveMatchCard({ match }) {
  if (!match) return null;

  const matchId = match.id || "163017";
  const title = match.title || "Cricket Match";
  const venue = match.venue || "Stadium";
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

  return (
    <div className="card-broadcast-match live-card">
      <div className="card-top-bar">
        <div className="card-live-chip">
          <span className="pill-dot red" />
          <span>LIVE</span>
        </div>
        <span className="card-format-tag">{title.split(",")[1] || "FIXTURE"}</span>
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
          <span className="insight-chip">
            CRR {formatRunRate(score.run_rate)}
          </span>
        )}

        {score.partnership && (
          <span className="insight-chip">
            P'SHIP {score.partnership}
          </span>
        )}

        <div className="situation-line">{statusText}</div>
      </div>

      <div className="card-footer-bar">
        <div className="venue-group">
          <MapPin size={11} className="venue-icon" />
          <span className="venue-name">{venue}</span>
        </div>

        <div className="card-actions-flex">
          <Link to={`/live/${matchId}`} className="btn-card-action live" aria-label="Launch Overlay">
            <MonitorPlay size={13} />
            <span>Launch Overlay</span>
          </Link>
          <Link to={`/control/${matchId}`} className="btn-card-action control" aria-label="Open Control">
            <SlidersHorizontal size={13} />
            <span>Open Control</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
