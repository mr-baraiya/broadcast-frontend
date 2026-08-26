export function resolveVenue(match) {
  if (!match) return "Venue TBD";
  if (match.venue && typeof match.venue === "string" && match.venue.trim()) {
    return match.venue.trim();
  }
  return "Venue TBD";
}
