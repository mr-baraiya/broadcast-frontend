import React from "react";
import { Shield } from "lucide-react";
import { formatRunsWickets } from "../utils/formatScore";
import { getTeamInitials, getTeamLogoUrl } from "../utils/teamLogos";

export function TeamScore({ teamName, runs, wickets, overs, isBatting, align = "left", animScore = false, opponentScore = null }) {
  const initials = getTeamInitials(teamName);
  const logoUrl = getTeamLogoUrl(teamName);

  let formattedScore = "YET TO BAT";
  if (runs !== null && runs !== undefined) {
    formattedScore = formatRunsWickets(runs, wickets);
  } else if (opponentScore) {
    formattedScore = opponentScore;
  }

  const oversDisplay = isBatting && overs !== null ? `${overs} ov` : "";

  return (
    <div className={`ref-team-pill ${align} ${isBatting ? "batting-active-dominant" : "non-batting-muted"}`}>
      {/* Full-height Flag Circle */}
      <div className="ref-team-flag-circle-full">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={teamName}
            className="team-logo-circle-full-img"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="team-flag-text-badge-full">
            <Shield size={24} />
            <span>{initials}</span>
          </div>
        )}
      </div>

      <div className="ref-team-info-box">
        <div className="ref-team-title">{teamName || "TEAM"}</div>
        <div className="ref-score-digits-row">
          <span className={`ref-score-main ${isBatting ? "score-dominant-yellow" : "score-muted-ytb"} ${animScore ? "score-flash-yellow" : ""}`}>
            {formattedScore}
          </span>
          {oversDisplay && (
            <span className="ref-score-overs-inline">{oversDisplay}</span>
          )}
        </div>
      </div>
    </div>
  );
}
