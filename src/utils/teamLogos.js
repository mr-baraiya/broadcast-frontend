export function getTeamInitials(teamName) {
  if (!teamName || teamName === "TEAM A" || teamName === "TEAM B") return "TM";

  const words = teamName.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return teamName.substring(0, 3).toUpperCase();
}

export function getPlayerPortrait(player) {
  if (!player) return "https://api.dicebear.com/7.x/avataaars/svg?seed=Player";

  if (typeof player === "object") {
    if (player.image && typeof player.image === "string" && player.image.startsWith("http")) {
      return player.image;
    }
    const seed = encodeURIComponent(player.name || "Player");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  }

  const seed = encodeURIComponent(player);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}
