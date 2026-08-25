import React from "react";
import { Link } from "react-router-dom";
import { formatRunsWickets, formatOvers } from "../../utils/formatScore";
import { MonitorPlay, SlidersHorizontal } from "lucide-react";

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
            <th style={{ width: "240px", textAlign: "right" }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const matchId = match.id || "163017";
            const title = match.title || "Cricket Match";
            const venue = match.venue || "Stadium";
            const statusText = match.status_text || match.status || (isLive ? "LIVE" : "UPCOMING");

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
                  <span className={`status-pill ${isLive ? "live" : "upcoming"}`}>
                    {isLive ? "● LIVE" : "UPCOMING"}
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
                <td className="cell-actions">
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
