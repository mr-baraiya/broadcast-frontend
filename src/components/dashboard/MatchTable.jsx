import React from "react";
import { Link } from "react-router-dom";
import { formatRunsWickets, formatOvers } from "../../utils/formatScore";
import { MonitorPlay, SlidersHorizontal } from "lucide-react";

import { resolveVenue } from "../../utils/venueResolver";

export function MatchTable({ matches, isLive = true }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="table-empty-row">
        No {isLive ? "live" : "upcoming"} matches available matching your query.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="broadcast-match-table">
        <thead>
          <tr>
            <th style={{ width: "110px" }}>STATUS</th>
            <th style={{ minWidth: "220px" }}>MATCH TITLE</th>
            <th style={{ minWidth: "200px" }}>SCORE / OVERS</th>
            <th style={{ minWidth: "260px" }}>SITUATION / DETAILS</th>
            <th style={{ minWidth: "180px" }}>VENUE</th>
            <th style={{ width: "270px", textAlign: "right", whiteSpace: "nowrap" }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const matchId = match.id || "163017";
            const title = match.title || "Cricket Match";
            const venue = resolveVenue(match);
            const statusText = match.status_text || match.status || (isLive ? "LIVE" : "UPCOMING");
            const rawStatus = (match.status || "").toUpperCase();
            const stLower = (statusText || "").toLowerCase();

            let displayStatus = "LIVE";
            let statusClass = "live";

            if (rawStatus === "COMPLETED" || stLower.includes("won by") || stLower.includes("won")) {
              displayStatus = "RESULT";
              statusClass = "completed";
            } else if (stLower.includes("lunch")) {
              displayStatus = "LUNCH";
              statusClass = "break";
            } else if (stLower.includes("tea")) {
              displayStatus = "TEA BREAK";
              statusClass = "break";
            } else if (stLower.includes("stumps")) {
              displayStatus = "STUMPS";
              statusClass = "break";
            } else if (stLower.includes("delay") || stLower.includes("rain")) {
              displayStatus = "DELAYED";
              statusClass = "break";
            } else if (!isLive || rawStatus === "UPCOMING") {
              displayStatus = "UPCOMING";
              statusClass = "upcoming";
            } else {
              displayStatus = "● LIVE";
              statusClass = "live";
            }

            const teams = Array.isArray(match.teams) ? match.teams : ["TEAM A", "TEAM B"];
            const teamA = teams[0] || "TEAM A";
            const teamB = teams[1] || "TEAM B";

            const score = match.score || {};
            const battingTeam = score.team || teamA;
            const runsWkts = score.runs !== undefined && score.runs !== null
              ? formatRunsWickets(score.runs, score.wickets)
              : null;
            const overs = score.overs !== undefined && score.overs !== null
              ? formatOvers(score.overs)
              : null;

            return (
              <tr key={matchId} className="table-row">
                {/* Status Column */}
                <td>
                  <span className={`status-pill ${statusClass}`}>
                    {displayStatus}
                  </span>
                </td>

                {/* Match Title Column */}
                <td className="cell-title">
                  <span className="match-title-text">{title}</span>
                </td>

                {/* Score / Overs Column */}
                <td className="cell-score">
                  {runsWkts ? (
                    <div className="score-stack">
                      <span className="score-bold">{battingTeam} {runsWkts}</span>
                      {overs && <span className="overs-muted">{overs}</span>}
                    </div>
                  ) : (
                    <span className="score-pending">{teamA} vs {teamB}</span>
                  )}
                </td>

                {/* Situation / Details Column */}
                <td className="cell-situation">
                  <span className="situation-text">{statusText}</span>
                </td>

                {/* Venue Column */}
                <td className="cell-venue">
                  <span className="venue-text">{venue}</span>
                </td>

                {/* Actions Column */}
                <td className="cell-actions" style={{ whiteSpace: "nowrap" }}>

                  <div className="actions-flex">
                    <Link to={`/live/${matchId}`} className="btn-table-action live">
                      <MonitorPlay size={14} />
                      <span>Live Overlay</span>
                    </Link>
                    <Link to={`/control/${matchId}`} className="btn-table-action control">
                      <SlidersHorizontal size={14} />
                      <span>Control</span>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
