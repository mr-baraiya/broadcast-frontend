import { formatRunsWickets, formatOvers } from "./formatScore";

export function buildBroadcastTickerSegments(matchData) {
  if (!matchData) return [];

  const { title, teams, score, statusText, venue, players } = matchData;
  const segments = [];

  const teamA = teams?.teamA || "TEAM A";
  const teamB = teams?.teamB || "TEAM B";
  const battingTeam = score?.team || teamA;

  // 1. Live Match Header
  segments.push({
    id: "live_header",
    label: "LIVE BROADCAST",
    value: title || `${teamA} vs ${teamB}`,
    badge: "LIVE"
  });

  // 2. Main Score Segment
  if (score && score.runs !== null) {
    segments.push({
      id: "score_info",
      label: "CURRENT SCORE",
      value: `${battingTeam.toUpperCase()} ${formatRunsWickets(score.runs, score.wickets)} ${formatOvers(score.overs)}`,
      badge: "SCORE"
    });
  }

  // 3. Match Status
  if (statusText) {
    segments.push({
      id: "status_info",
      label: "MATCH SITUATION",
      value: statusText,
      badge: "SITUATION"
    });
  }

  // 4. CRR
  if (score && score.crr) {
    segments.push({
      id: "crr_info",
      label: "RUN RATE",
      value: `CRR: ${score.crr}`,
      badge: "CRR"
    });
  }

  // 5. Partnership
  if (score && score.partnership) {
    segments.push({
      id: "partnership_info",
      label: "PARTNERSHIP",
      value: `${score.partnership} RUNS`,
      badge: "PARTNERSHIP"
    });
  }

  // 6. Target / RRR / Trail By
  if (score && score.target) {
    segments.push({
      id: "target_info",
      label: "TARGET",
      value: `TARGET: ${score.target}`,
      badge: "TARGET"
    });
  }

  if (score && score.trailBy) {
    segments.push({
      id: "trail_info",
      label: "TRAIL BY",
      value: `${score.trailBy}`,
      badge: "TRAIL"
    });
  }

  // 7. Active Striker
  if (players && players.striker) {
    const s = players.striker;
    segments.push({
      id: "striker_info",
      label: "ON STRIKE",
      value: `${s.name || "Batsman"} ${s.runs ?? 0} (${s.balls ?? 0}b)`,
      badge: "BATSMAN"
    });
  }

  // 8. Active Bowler
  if (players && players.bowler) {
    const b = players.bowler;
    segments.push({
      id: "bowler_info",
      label: "BOWLING",
      value: `${b.name || "Bowler"} ${b.wickets ?? 0}-${b.runs ?? 0} (${b.overs ?? 0} ov)`,
      badge: "BOWLER"
    });
  }

  // 9. Venue
  if (venue) {
    segments.push({
      id: "venue_info",
      label: "VENUE",
      value: venue,
      badge: "VENUE"
    });
  }

  return segments;
}
