import React from "react";
import { TeamScore } from "./TeamScore";
import { MATCH_STATE_TYPES } from "../utils/matchState";

export function Scoreboard({ matchData, animScore, stateInfo }) {
  if (!matchData) return null;

  const { teams, score } = matchData;
  const teamA = teams?.teamA || "SRI LANKA";
  const teamB = teams?.teamB || "INDIA";

  const battingTeamStr = (score?.team || "").toLowerCase().trim();
  const teamALower = teamA.toLowerCase().trim();
  const teamBLower = teamB.toLowerCase().trim();

  let isTeamABatting = true;
  if (battingTeamStr) {
    if (battingTeamStr === teamBLower || (teamBLower.length >= 2 && battingTeamStr.includes(teamBLower))) {
      isTeamABatting = false;
    } else if (battingTeamStr === teamALower || (teamALower.length >= 2 && battingTeamStr.includes(teamALower))) {
      isTeamABatting = true;
    }
  }

  const rawInningNum = score?.inningNumber || 1;

  let inningBadgeText = rawInningNum === 1 ? "1ST" : `${rawInningNum}ND`;
  if (stateInfo?.type === MATCH_STATE_TYPES.NOT_STARTED) {
    inningBadgeText = "PRE";
  } else if (stateInfo?.type === MATCH_STATE_TYPES.BREAK) {
    inningBadgeText = "BREAK";
  } else if (stateInfo?.type === MATCH_STATE_TYPES.COMPLETED) {
    inningBadgeText = "END";
  }

  return (
    <div className="ref-top-scoreboard-container">
      <TeamScore
        teamName={teamA}
        runs={isTeamABatting ? score.runs : null}
        wickets={isTeamABatting ? score.wickets : null}
        overs={isTeamABatting ? score.overs : null}
        isBatting={isTeamABatting}
        align="left"
        animScore={isTeamABatting && animScore}
      />

      <div className="ref-center-oval-badge">
        <div className="giant-inning-digit" style={{ fontSize: inningBadgeText.length > 3 ? "0.95rem" : "1.4rem" }}>
          {inningBadgeText}
        </div>
      </div>

      <TeamScore
        teamName={teamB}
        runs={!isTeamABatting ? score.runs : null}
        wickets={!isTeamABatting ? score.wickets : null}
        overs={!isTeamABatting ? score.overs : null}
        isBatting={!isTeamABatting}
        align="right"
        animScore={!isTeamABatting && animScore}
      />
    </div>
  );
}

