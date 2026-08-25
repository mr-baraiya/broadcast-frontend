import React from "react";
import { Link } from "react-router-dom";
import { MonitorPlay, SlidersHorizontal, MapPin, Calendar } from "lucide-react";
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
        <div className="card-upcoming-chip">
          <span>UPCOMING</span>
        </div>
        <span className="card-format-tag">SCHEDULED</span>
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
        <div className="schedule-item">
          <Calendar size={12} />
          <span>{dateStr}</span>
        </div>
        <div className="title-item">{title}</div>
      </div>

      <div className="card-footer-bar">
        <div className="venue-group">
          <MapPin size={11} className="venue-icon" />
          <span className="venue-name">{venue}</span>
        </div>

        <div className="card-actions-flex">
          <Link to={`/live/${matchId}`} className="btn-card-action live" aria-label="Launch Overlay">
            <MonitorPlay size={13} />
            <span>Overlay</span>
          </Link>
          <Link to={`/control/${matchId}`} className="btn-card-action control" aria-label="Open Control">
            <SlidersHorizontal size={13} />
            <span>Control</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
