import React from "react";
import { Link } from "react-router-dom";
import { getTeamInitials } from "../../utils/teamLogos";

export function UpcomingMatchCard({ match }) {
  if (!match) return null;

  const matchId = match.id || "1001";
  const title = match.title || "Upcoming Match";
  const venue = match.venue || "Stadium";
  const dateStr = match.date || "Schedule TBA";

  const teams = Array.isArray(match.teams) ? match.teams : ["TEAM A", "TEAM B"];
  const teamA = teams[0] || "TEAM A";
  const teamB = teams[1] || "TEAM B";

  const initialsA = getTeamInitials(teamA);
  const initialsB = getTeamInitials(teamB);

  return (
    <div className="card-broadcast-match upcoming-card">
      <div className="card-top-bar">
        <span className="card-upcoming-chip">Upcoming</span>
        <span className="card-format-tag">Scheduled</span>
      </div>

      <div className="card-versus-row">
        <div className="versus-team">
          <span className="team-shield-badge large">{initialsA}</span>
          <span className="team-name">{teamA}</span>
        </div>
        <span className="vs-badge">VS</span>
        <div className="versus-team">
          <span className="team-shield-badge large">{initialsB}</span>
          <span className="team-name">{teamB}</span>
        </div>
      </div>

      <div className="card-schedule-info">
        <div className="schedule-item">{dateStr}</div>
        <div className="title-item">{title}</div>
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
