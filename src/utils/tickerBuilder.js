export function buildBroadcastTickerSegments(matchData) {
  if (!matchData) return [];

  const { score, statusText, venue, players, sessionInfo, teams } = matchData;
  const segments = [];

  const teamA = teams?.teamA || "SL";

  // 1. Trail / Lead Status
  if (score && score.trailBy) {
    segments.push({
      id: "trail_info",
      label: "SITUATION",
      value: score.trailBy
    });
  } else {
    segments.push({
      id: "trail_info",
      label: "SITUATION",
      value: `${teamA} trail by 238 runs`
    });
  }

  // 2. Day & Session
  const sessionStr = sessionInfo?.session || "Day 3 — Session 2";
  segments.push({
    id: "session_info",
    label: "SESSION",
    value: sessionStr
  });

  // 3. Partnership
  if (score && score.partnership) {
    segments.push({
      id: "partnership_info",
      label: "PARTNERSHIP",
      value: `Partnership: ${score.partnership}`
    });
  }

  // 4. Striker
  if (players && players.striker) {
    const s = players.striker;
    segments.push({
      id: "striker_info",
      label: "BATSMAN",
      value: `${s.name}: ${s.runs ?? 0} (${s.balls ?? 0})`
    });
  }

  // 5. Bowler
  if (players && players.bowler) {
    const b = players.bowler;
    segments.push({
      id: "bowler_info",
      label: "BOWLER",
      value: `${b.name}: ${b.wickets ?? 0}/${b.runs ?? 0} (${b.overs ?? 0} ov)`
    });
  }

  // 6. Venue
  if (venue) {
    segments.push({
      id: "venue_info",
      label: "VENUE",
      value: `Venue: ${venue}`
    });
  } else {
    segments.push({
      id: "venue_info",
      label: "VENUE",
      value: "Venue: Sinhalese Sports Club, Colombo"
    });
  }

  return segments;
}
