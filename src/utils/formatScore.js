export function formatRunsWickets(runs, wickets) {
  if (runs === null || runs === undefined) return "—";
  if (wickets === null || wickets === undefined) return `${runs}`;
  return `${runs}/${wickets}`;
}

export function formatOvers(overs) {
  if (overs === null || overs === undefined) return "";
  return `(${overs} ov)`;
}

export function formatRunRate(rr) {
  if (rr === null || rr === undefined) return "—";
  return typeof rr === "number" ? rr.toFixed(2) : `${rr}`;
}

export function formatStrikeRate(sr) {
  if (sr === null || sr === undefined) return "—";
  return typeof sr === "number" ? sr.toFixed(1) : `${sr}`;
}
