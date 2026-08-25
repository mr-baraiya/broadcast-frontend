import React from "react";
import { Shield } from "lucide-react";
import { formatRunsWickets, formatOvers } from "../utils/formatScore";
import { getTeamInitials } from "../utils/teamLogos";

export function TeamScore({ teamName, runs, wickets, overs, isBatting, align = "left", animScore = false }) {
  const initials = getTeamInitials(teamName);
  const formattedScore = runs !== null && runs !== undefined
    ? formatRunsWickets(runs, wickets)
    : "YET TO BAT";
  const formattedOvers = isBatting && overs !== null ? formatOvers(overs) : "";

  return (
    <div className={`ref-team-pill ${align} ${isBatting ? "batting-active" : "non-batting"}`}>
      <div className="ref-team-flag-wrap">
        <Shield size={20} className="shield-icon-tv" />
        <span className="ref-team-initials">{initials}</span>
      </div>

      <div className="ref-team-info">
        <div className="ref-team-name">{teamName || "TEAM"}</div>
        <div className="ref-score-row">
          <span className={`ref-score-digits ${isBatting ? "active" : "muted"} ${animScore ? "animate-score" : ""}`}>
            {formattedScore}
          </span>
          {formattedOvers && (
            <span className="ref-score-overs">{formattedOvers}</span>
          )}
        </div>
      </div>
    </div>
  );
}
