export function detectBroadcastEvent(prevMatch, currMatch) {
  if (!currMatch || !prevMatch) return null;

  const prevScore = prevMatch.score || {};
  const currScore = currMatch.score || {};
  const latestEv = currMatch.latestEvent || {};
  const prevLatestEv = prevMatch.latestEvent || {};

  const isNewEvent = latestEv.event_id && (!prevLatestEv.event_id || latestEv.event_id !== prevLatestEv.event_id);

  // 1. WICKET Event (Priority 1)
  const isWicketByScore = (currScore.wickets ?? 0) > (prevScore.wickets ?? 0);
  const isWicketByEvent = isNewEvent && (latestEv.event === "WICKET" || latestEv.event === "OUT");

  if (isWicketByScore || isWicketByEvent) {
    const lastWktText = currScore.lastWicket || latestEv.text || "OUT!";
    return {
      type: "WICKET",
      priority: 1,
      duration: 1500,
      title: "WICKET!",
      text: lastWktText,
      data: {
        batsman: latestEv.batsman || currMatch.players?.striker?.name || "Batsman",
        dismissal: lastWktText
      }
    };
  }

  // 2. SIX Event (Priority 2)
  const isSixByEvent = isNewEvent && (latestEv.event === "SIX" || latestEv.runs === 6);
  const isSixByRuns = !isNewEvent && (currScore.runs ?? 0) - (prevScore.runs ?? 0) === 6;

  if (isSixByEvent || isSixByRuns) {
    return {
      type: "SIX",
      priority: 2,
      duration: 1100,
      title: "SIX!",
      text: latestEv.text || "6 RUNS!",
      data: { runs: 6 }
    };
  }

  // 3. FOUR Event (Priority 3)
  const isFourByEvent = isNewEvent && (latestEv.event === "FOUR" || latestEv.runs === 4);
  const isFourByRuns = !isNewEvent && (currScore.runs ?? 0) - (prevScore.runs ?? 0) === 4;

  if (isFourByEvent || isFourByRuns) {
    return {
      type: "FOUR",
      priority: 3,
      duration: 900,
      title: "FOUR!",
      text: latestEv.text || "4 RUNS!",
      data: { runs: 4 }
    };
  }

  // 4. Normal Runs (+1, +2, +3) (Priority 4)
  const diffRuns = (currScore.runs ?? 0) - (prevScore.runs ?? 0);
  if (diffRuns >= 1 && diffRuns <= 3) {
    return {
      type: "RUNS",
      priority: 4,
      duration: 750,
      title: `+${diffRuns}`,
      text: `${diffRuns} RUN${diffRuns > 1 ? "S" : ""}`
    };
  }

  return null;
}
