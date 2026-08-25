export function detectBroadcastEvent(prevMatch, currMatch) {
  if (!currMatch) return null;
  if (!prevMatch) return null;

  const prevScore = prevMatch.score || {};
  const currScore = currMatch.score || {};
  const latestEv = currMatch.latestEvent || {};
  const prevLatestEv = prevMatch.latestEvent || {};

  // Check if latest delivery event is brand new
  const isNewEvent = latestEv.event_id && (!prevLatestEv.event_id || latestEv.event_id !== prevLatestEv.event_id);

  // 1. WICKET Event (Priority 1)
  const isWicketByScore = (currScore.wickets ?? 0) > (prevScore.wickets ?? 0);
  const isWicketByEvent = isNewEvent && (latestEv.event === "WICKET" || latestEv.event === "OUT");

  if (isWicketByScore || isWicketByEvent) {
    const lastWktText = currScore.lastWicket || latestEv.text || "WICKET!";
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

  // 2. SIX Event (Priority 3)
  const isSixByEvent = isNewEvent && (latestEv.event === "SIX" || latestEv.runs === 6);
  const isSixByRuns = !isNewEvent && (currScore.runs ?? 0) - (prevScore.runs ?? 0) === 6;

  if (isSixByEvent || isSixByRuns) {
    return {
      type: "SIX",
      priority: 3,
      duration: 1200,
      title: "SIX!",
      text: latestEv.text || "Massive hit over the boundary!",
      data: {
        batsman: currMatch.players?.striker?.name || "Batsman",
        runs: 6
      }
    };
  }

  // 3. FOUR Event (Priority 4)
  const isFourByEvent = isNewEvent && (latestEv.event === "FOUR" || latestEv.runs === 4);
  const isFourByRuns = !isNewEvent && (currScore.runs ?? 0) - (prevScore.runs ?? 0) === 4;

  if (isFourByEvent || isFourByRuns) {
    return {
      type: "FOUR",
      priority: 4,
      duration: 1000,
      title: "FOUR!",
      text: latestEv.text || "Driven past the field for four runs!",
      data: {
        batsman: currMatch.players?.striker?.name || "Batsman",
        runs: 4
      }
    };
  }

  // 4. Milestone Check (Fifty / Century) (Priority 5)
  const currStriker = currMatch.players?.striker;
  const prevStriker = prevMatch.players?.striker;

  if (currStriker && prevStriker && currStriker.name === prevStriker.name) {
    if (prevStriker.runs < 50 && currStriker.runs >= 50) {
      return {
        type: "MILESTONE",
        priority: 5,
        duration: 1400,
        title: "HALF CENTURY!",
        text: `${currStriker.name} reaches 50 runs!`,
        data: { batsman: currStriker.name, runs: currStriker.runs }
      };
    }

    if (prevStriker.runs < 100 && currStriker.runs >= 100) {
      return {
        type: "MILESTONE",
        priority: 5,
        duration: 1600,
        title: "CENTURY!",
        text: `${currStriker.name} reaches magnificent 100 runs!`,
        data: { batsman: currStriker.name, runs: currStriker.runs }
      };
    }
  }

  return null;
}
