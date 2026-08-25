export function normalizeMatchData(rawPayload) {
  if (!rawPayload) return null;

  const data = rawPayload.data || rawPayload;
  const match = data.match || {};
  const score = data.score || {};

  const teams = Array.isArray(match.teams) && match.teams.length >= 2
    ? match.teams
    : (match.title ? match.title.split(" vs ") : ["TEAM A", "TEAM B"]);

  const battingTeam = score.team || teams[0];
  const bowlingTeam = teams.find(t => t.toLowerCase() !== battingTeam.toLowerCase()) || teams[1];

  const batsmen = Array.isArray(data.batsmen) ? data.batsmen : [];
  const currentBatsmen = Array.isArray(data.current_batsmen) && data.current_batsmen.length > 0
    ? data.current_batsmen
    : batsmen.filter(b => b.active);

  const striker = currentBatsmen[0] || batsmen[0] || null;
  const nonStriker = currentBatsmen[1] || batsmen[1] || null;

  const bowlers = Array.isArray(data.bowlers) ? data.bowlers : [];
  const currentBowler = data.current_bowler || bowlers[0] || null;

  const commentary = Array.isArray(data.commentary) ? data.commentary : [];

  // Parse and clean recent delivery events
  const rawRecent = Array.isArray(data.recent_balls) && data.recent_balls.length > 0
    ? data.recent_balls
    : commentary.slice(0, 12);

  const cleanBalls = rawRecent
    .map((item) => {
      let ev = (item.event || "").toUpperCase();
      let runs = item.runs;

      if (ev === "WICKET" || ev === "OUT" || ev === "W") {
        return { ...item, event: "WICKET", label: "W" };
      }
      if (ev === "SIX" || runs === 6) {
        return { ...item, event: "SIX", label: "6" };
      }
      if (ev === "FOUR" || runs === 4) {
        return { ...item, event: "FOUR", label: "4" };
      }
      if (ev === "WIDE" || ev === "WD") {
        return { ...item, event: "WIDE", label: "WD" };
      }
      if (ev === "NO_BALL" || ev === "NB") {
        return { ...item, event: "NO_BALL", label: "NB" };
      }
      if (runs === 0 || ev === "DOT") {
        return { ...item, event: "DOT", label: "0" };
      }

      if (typeof runs === "number" && runs >= 0 && runs <= 6) {
        return { ...item, label: `${runs}` };
      }

      return { ...item, label: "0" };
    })
    .filter(Boolean);

  // Group deliveries into Over A (Current Over) and Over B (Previous Over)
  const overCurrentNum = score.overs ? Math.floor(score.overs) : 0;
  const overPrevNum = overCurrentNum > 1 ? overCurrentNum - 1 : 0;

  const overPrevBalls = cleanBalls.slice(6, 12);
  const overCurrBalls = cleanBalls.slice(0, 6);

  const overPrevTotal = overPrevBalls.reduce((acc, b) => acc + (typeof b.runs === "number" ? b.runs : 0), 0);
  const overCurrTotal = overCurrBalls.reduce((acc, b) => acc + (typeof b.runs === "number" ? b.runs : 0), 0);

  const latestEvent = commentary[0] || null;

  return {
    id: match.id || "",
    title: match.title || `${teams[0]} vs ${teams[1]}`,
    teams: {
      batting: battingTeam,
      bowling: bowlingTeam,
      teamA: teams[0],
      teamB: teams[1]
    },
    status: match.status || "LIVE",
    statusText: match.status_text || match.status || "",
    venue: match.venue || null,
    date: match.date || null,

    score: {
      team: score.team || battingTeam,
      runs: score.runs ?? 0,
      wickets: score.wickets ?? 0,
      overs: score.overs ?? 0,
      crr: score.run_rate ?? data.crr ?? null,
      rrr: data.rrr ?? null,
      target: data.target ?? null,
      trailBy: data.trail_by || null,
      partnership: data.partnership || null,
      lastWicket: data.last_wicket || null,
      nextBatsman: data.next_batsman || null,
      toss: data.toss || null,
      inningNumber: data.inning_number || 1
    },

    winProbability: data.win_probability || null,

    sessionInfo: data.session_info || null,

    players: {
      striker: striker,
      nonStriker: nonStriker,
      bowler: currentBowler,
      allBatsmen: batsmen,
      allBowlers: bowlers
    },

    oversTimeline: {
      prevOverNum: overPrevNum,
      prevOverBalls: overPrevBalls,
      prevOverTotal: overPrevTotal,
      currOverNum: overCurrentNum,
      currOverBalls: overCurrBalls,
      currOverTotal: overCurrTotal
    },

    commentary,
    recentBalls: cleanBalls,
    latestEvent,
    dataStatus: data.data_status || "fresh",
    updatedAt: rawPayload.updated_at || new Date().toISOString()
  };
}
