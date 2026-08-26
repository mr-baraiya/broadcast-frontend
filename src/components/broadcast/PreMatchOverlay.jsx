import React from "react";
import { getTeamLogoUrl, getTeamInitials } from "../../utils/teamLogos";
import { Calendar, MapPin, Clock, Trophy, AlertCircle } from "lucide-react";
import "../../styles/broadcastStateOverlays.css";

export function PreMatchOverlay({ matchData, stateInfo }) {
  if (!matchData) return null;

  const { teams, venue, date, title } = matchData;
  const teamA = teams?.teamA || teams?.batting || "TEAM A";
  const teamB = teams?.teamB || teams?.bowling || "TEAM B";

  const logoA = getTeamLogoUrl(teamA);
  const logoB = getTeamLogoUrl(teamB);

  const tossInfo = matchData.score?.toss || matchData.toss || "Toss: Yet to take place";
  const statusMsg = stateInfo?.statusText || matchData.statusText || "Match scheduled to start soon";

  return (
    <div className="state-overlay-container">
      <div className="pre-match-card-stage">
        {/* Top Header Badge */}
        <div className="pre-match-top-badge">
          <span className="state-pulse-dot" />
          <span>{stateInfo?.badgeText || "MATCH NOT STARTED"}</span>
        </div>




        {/* Hero Teams VS Presentation */}
        <div className="pre-match-teams-vs">
          <div className="team-hero-box">
            {logoA ? (
              <img src={logoA} alt={teamA} className="team-hero-logo" />
            ) : (
              <div className="team-hero-logo-fallback">{getTeamInitials(teamA)}</div>
            )}
            <h2 className="team-hero-name">{teamA}</h2>
          </div>

          <div className="vs-circle">VS</div>

          <div className="team-hero-box">
            {logoB ? (
              <img src={logoB} alt={teamB} className="team-hero-logo" />
            ) : (
              <div className="team-hero-logo-fallback">{getTeamInitials(teamB)}</div>
            )}
            <h2 className="team-hero-name">{teamB}</h2>
          </div>
        </div>

        {/* Details Grid (Venue, Date, Toss) */}
        <div className="pre-match-details-grid">
          <div className="pre-detail-item">
            <span className="pre-detail-lbl">SERIES / MATCH</span>
            <span className="pre-detail-val gold">{title || `${teamA} vs ${teamB}`}</span>
          </div>

          <div className="pre-detail-divider" />

          <div className="pre-detail-item">
            <span className="pre-detail-lbl">VENUE</span>
            <span className="pre-detail-val" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MapPin size={15} color="#38bdf8" />
              {venue || "International Stadium"}
            </span>
          </div>

          <div className="pre-detail-divider" />

          <div className="pre-detail-item">
            <span className="pre-detail-lbl">TOSS STATUS</span>
            <span className="pre-detail-val" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Trophy size={15} color="#facc15" />
              {tossInfo}
            </span>
          </div>
        </div>

        {/* Status Message / Start Time Banner */}
        <div className="pre-match-status-box" style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38bdf8" }}>
          <Clock size={18} />
          <strong>MATCH NOT STARTED</strong>
          <span style={{ color: "#e2e8f0", marginLeft: "0.5rem" }}>— {statusMsg}</span>
        </div>
      </div>
    </div>
  );
}
