import { calculateStrikeRate, calculateEconomy, oversToLegalBalls } from "./formatScore";

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

  let rawStriker = currentBatsmen[0] || batsmen[0] || null;
  let rawNonStriker = currentBatsmen[1] || batsmen[1] || null;

  // Precision Strike Rate calculation (72.73, 70.83)
  const striker = rawStriker ? {
    ...rawStriker,
    strike_rate: (rawStriker.runs !== null && rawStriker.balls > 0)
      ? parseFloat(calculateStrikeRate(rawStriker.runs, rawStriker.balls))
      : (rawStriker.strike_rate || 0)
  } : null;

  const nonStriker = rawNonStriker ? {
    ...rawNonStriker,
    strike_rate: (rawNonStriker.runs !== null && rawNonStriker.balls > 0)
      ? parseFloat(calculateStrikeRate(rawNonStriker.runs, rawNonStriker.balls))
      : (rawNonStriker.strike_rate || 0)
  } : null;

  const bowlers = Array.isArray(data.bowlers) ? data.bowlers : [];
  let rawBowler = data.current_bowler || bowlers[0] || null;

  // Precision Economy calculation (e.g. 72 runs in 18.2 overs -> 3.93)
  const bowler = rawBowler ? {
    ...rawBowler,
    economy: (rawBowler.runs !== null && rawBowler.overs)
      ? parseFloat(calculateEconomy(rawBowler.runs, rawBowler.overs))
      : (rawBowler.economy || 0)
  } : null;

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

  // Derive last ball delivery directly from cleanBalls[0] / commentary[0] (Fixes LAST BALL mismatch)
  const latestDelivery = cleanBalls[0] || null;
  const latestComm = commentary[0] || null;

  let lastBallBadge = "DOT";
  let lastBallLabel = "LAST BALL: DOT";
  let lastBallText = "Delivery complete.";

  if (latestDelivery) {
    if (latestDelivery.label === "W") {
      lastBallBadge = "WICKET";
      lastBallLabel = "LAST BALL: WICKET";
    } else if (latestDelivery.label === "6") {
      lastBallBadge = "SIX";
      lastBallLabel = "LAST BALL: SIX";
    } else if (latestDelivery.label === "4") {
      lastBallBadge = "FOUR";
      lastBallLabel = "LAST BALL: FOUR";
    } else {
      lastBallBadge = `${latestDelivery.label} RUNS`;
      lastBallLabel = `LAST BALL: ${latestDelivery.label} RUNS`;
    }
  }

  if (latestComm && latestComm.commentary) {
    lastBallText = latestComm.commentary;
  } else if (bowler && striker && latestDelivery) {
    lastBallText = `${bowler.name} to ${striker.name} — ${latestDelivery.label === "W" ? "WICKET!" : `${latestDelivery.label} run(s)`}`;
  }

  // Group deliveries into Over A (Current Over) and Over B (Previous Over)
  const overCurrentNum = score.overs ? Math.floor(score.overs) : 0;
  const overPrevNum = overCurrentNum > 1 ? overCurrentNum - 1 : 0;

  const overPrevBalls = cleanBalls.slice(6, 12);
  const overCurrBalls = cleanBalls.slice(0, 6);

  const overPrevTotal = overPrevBalls.reduce((acc, b) => acc + (typeof b.runs === "number" ? b.runs : 0), 0);
  const overCurrTotal = overCurrBalls.reduce((acc, b) => acc + (typeof b.runs === "number" ? b.runs : 0), 0);

  // Innings State (1st INNINGS / 2nd INNINGS)
  const rawInningNum = data.inning_number || (data.innings && data.innings.number) || 1;
  const inningLabel = rawInningNum === 1 ? "1st INNINGS" : `${rawInningNum}nd INNINGS`;

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
      inningNumber: rawInningNum,
      inningLabel: inningLabel
    },

    lastBall: {
      badge: lastBallBadge,
      label: lastBallLabel,
      text: lastBallText,
      event: latestDelivery ? latestDelivery.event : null
    },

    winProbability: data.win_probability || null,
    sessionInfo: data.session_info || null,

    players: {
      striker: striker,
      nonStriker: nonStriker,
      bowler: bowler,
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
    latestEvent: latestComm,
    dataStatus: data.data_status || "fresh",
    updatedAt: rawPayload.updated_at || new Date().toISOString()
  };
}
