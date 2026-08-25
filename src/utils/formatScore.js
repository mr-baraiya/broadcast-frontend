export function oversToLegalBalls(overs) {
  if (overs === null || overs === undefined) return 0;
  const sOvers = String(overs).trim();
  if (!sOvers) return 0;

  if (sOvers.includes(".")) {
    const parts = sOvers.split(".");
    const completedOvers = parseInt(parts[0], 10) || 0;
    const ballsInOver = parseInt(parts[1], 10) || 0;
    return (completedOvers * 6) + Math.min(ballsInOver, 5);
  }
  return (parseInt(sOvers, 10) || 0) * 6;
}

export function calculateEconomy(runs, overs) {
  if (runs === null || runs === undefined || overs === null || overs === undefined) return "—";
  const legalBalls = oversToLegalBalls(overs);
  if (!legalBalls || legalBalls <= 0) return "0.00";
  const econ = (runs * 6) / legalBalls;
  return econ.toFixed(2);
}

export function calculateStrikeRate(runs, balls) {
  if (runs === null || runs === undefined || !balls || balls <= 0) return "0.00";
  const sr = (runs / balls) * 100;
  return sr.toFixed(2);
}

export function formatRunsWickets(runs, wickets) {
  if (runs === null || runs === undefined) return "—";
  if (wickets === null || wickets === undefined) return `${runs}`;
  return `${runs}/${wickets}`;
}

export function formatRunsWicketsDash(runs, wickets) {
  if (runs === null || runs === undefined) return "—";
  if (wickets === null || wickets === undefined) return `${runs}`;
  return `${runs}-${wickets}`;
}

export function formatOvers(overs) {
  if (overs === null || overs === undefined) return "";
  return `(${overs} ov)`;
}

export function formatRunRate(rr) {
  if (rr === null || rr === undefined) return "—";
  return typeof rr === "number" ? rr.toFixed(2) : `${rr}`;
}

export function formatStrikeRate(sr, runs = null, balls = null) {
  if (runs !== null && balls !== null && balls > 0) {
    return calculateStrikeRate(runs, balls);
  }
  if (sr === null || sr === undefined) return "—";
  return typeof sr === "number" ? sr.toFixed(2) : `${sr}`;
}
