export const MATCH_STATE_TYPES = {
  NOT_STARTED: "NOT_STARTED",
  BREAK: "BREAK",
  COMPLETED: "COMPLETED",
  LIVE: "LIVE"
};

export const BREAK_SUBTYPES = {
  INNINGS_BREAK: "INNINGS_BREAK",
  RAIN_DELAY: "RAIN_DELAY",
  LUNCH: "LUNCH",
  TEA: "TEA",
  DRINKS: "DRINKS",
  TIMEOUT: "TIMEOUT",
  STUMPS: "STUMPS",
  GENERAL: "GENERAL"
};

export function getMatchState(matchData, controlState = {}) {
  // Check for operator manual state override
  const override = controlState?.matchStateOverride || controlState?.overrideState;

  if (override && override !== "AUTO") {
    switch (override.toUpperCase()) {
      case "NOT_STARTED":
      case "UPCOMING":
      case "PRE":
        return {
          type: MATCH_STATE_TYPES.NOT_STARTED,
          breakType: null,
          title: "UPCOMING MATCH",
          subtitle: "Match Has Not Started Yet",
          badgeText: "UPCOMING",
          statusText: controlState?.customStatusText || matchData?.statusText || "Match scheduled to start soon",
          isOverride: true
        };

      case "INNINGS_BREAK":
        return {
          type: MATCH_STATE_TYPES.BREAK,
          breakType: BREAK_SUBTYPES.INNINGS_BREAK,
          title: "INNINGS BREAK",
          subtitle: "End of 1st Innings",
          badgeText: "INNINGS BREAK",
          statusText: controlState?.customStatusText || matchData?.statusText || "Innings break in progress — 2nd Innings starting shortly",
          isOverride: true
        };

      case "RAIN_DELAY":
      case "RAIN":
      case "DELAYED":
        return {
          type: MATCH_STATE_TYPES.BREAK,
          breakType: BREAK_SUBTYPES.RAIN_DELAY,
          title: "RAIN DELAY",
          subtitle: "Play Interrupted by Weather",
          badgeText: "PLAY DELAYED",
          statusText: controlState?.customStatusText || matchData?.statusText || "Play delayed due to rain • Pitch covers on field",
          isOverride: true
        };

      case "LUNCH":
        return {
          type: MATCH_STATE_TYPES.BREAK,
          breakType: BREAK_SUBTYPES.LUNCH,
          title: "LUNCH BREAK",
          subtitle: "Day Session Interval",
          badgeText: "LUNCH",
          statusText: controlState?.customStatusText || matchData?.statusText || "Players taking lunch • Play resumes shortly",
          isOverride: true
        };

      case "TEA":
        return {
          type: MATCH_STATE_TYPES.BREAK,
          breakType: BREAK_SUBTYPES.TEA,
          title: "TEA BREAK",
          subtitle: "Afternoon Session Interval",
          badgeText: "TEA BREAK",
          statusText: controlState?.customStatusText || matchData?.statusText || "Players taking tea • Play resumes shortly",
          isOverride: true
        };

      case "DRINKS":
        return {
          type: MATCH_STATE_TYPES.BREAK,
          breakType: BREAK_SUBTYPES.DRINKS,
          title: "DRINKS BREAK",
          subtitle: "Hydration Break",
          badgeText: "DRINKS",
          statusText: controlState?.customStatusText || matchData?.statusText || "Drinks break on the field",
          isOverride: true
        };

      case "TIMEOUT":
      case "STRATEGIC_TIMEOUT":
        return {
          type: MATCH_STATE_TYPES.BREAK,
          breakType: BREAK_SUBTYPES.TIMEOUT,
          title: "STRATEGIC TIMEOUT",
          subtitle: "Tactical Discussion",
          badgeText: "TIMEOUT",
          statusText: controlState?.customStatusText || matchData?.statusText || "Strategic timeout in progress",
          isOverride: true
        };

      case "COMPLETED":
      case "FINISHED":
        return {
          type: MATCH_STATE_TYPES.COMPLETED,
          breakType: null,
          title: "MATCH COMPLETED",
          subtitle: "Final Result",
          badgeText: "COMPLETED",
          statusText: controlState?.customStatusText || matchData?.statusText || "Match concluded",
          isOverride: true
        };

      case "LIVE":
        return {
          type: MATCH_STATE_TYPES.LIVE,
          breakType: null,
          title: "LIVE MATCH",
          subtitle: "In Progress",
          badgeText: "LIVE",
          statusText: matchData?.statusText || "Match in progress",
          isOverride: true
        };

      default:
        break;
    }
  }

  if (!matchData) {
    return {
      type: MATCH_STATE_TYPES.LIVE,
      breakType: null,
      title: "LIVE",
      subtitle: "",
      badgeText: "LIVE",
      statusText: "",
      isOverride: false
    };
  }

  const rawStatus = (matchData.status || "").toUpperCase();
  const rawStatusText = (matchData.statusText || matchData.status || "").toLowerCase();

  // 1. Detect NOT_STARTED (Upcoming, Pre-match)
  const upcomingKeywords = [
    "upcoming", "scheduled", "preview", "starts in", "starts at",
    "yet to start", "not started", "match starts", "toss at", "toss delayed"
  ];

  const isStatusUpcoming = ["UPCOMING", "PRE", "SCHEDULED", "NOT_STARTED", "YET_TO_START"].includes(rawStatus);
  const hasUpcomingText = upcomingKeywords.some(kw => rawStatusText.includes(kw));

  // If score is 0/0 (0.0 overs) and status indicates upcoming or no active batsmen
  const runs = matchData.score?.runs ?? 0;
  const wickets = matchData.score?.wickets ?? 0;
  const overs = matchData.score?.overs ?? 0;
  const hasNoInPlayData = overs === 0 && runs === 0 && wickets === 0 && !matchData.players?.striker?.name;

  if (isStatusUpcoming || hasUpcomingText || (hasNoInPlayData && rawStatus !== "LIVE")) {
    return {
      type: MATCH_STATE_TYPES.NOT_STARTED,
      breakType: null,
      title: "UPCOMING MATCH",
      subtitle: "Match Has Not Started Yet",
      badgeText: "MATCH NOT STARTED",
      statusText: matchData.statusText || "Match scheduled to start soon",
      isOverride: false
    };
  }

  // 2. Detect BREAK (Innings Break, Rain Delay, Lunch, Tea, Drinks, Strategic Timeout)
  const breakKeywords = [
    "innings break", "inning break", "break", "lunch", "tea", "drinks",
    "rain", "delay", "delayed", "wet outfield", "bad light", "strategic timeout",
    "timeout", "stumps", "covers"
  ];

  const isStatusBreak = ["BREAK", "INNINGS_BREAK", "RAIN_DELAY", "DELAYED", "LUNCH", "TEA", "DRINKS", "TIMEOUT", "STUMPS"].includes(rawStatus);
  const hasBreakText = breakKeywords.some(kw => rawStatusText.includes(kw));

  if (isStatusBreak || hasBreakText) {
    let breakType = BREAK_SUBTYPES.GENERAL;
    let title = "MATCH BREAK";
    let subtitle = "Play Suspended";
    let badgeText = "MATCH BREAK";

    if (rawStatusText.includes("rain") || rawStatusText.includes("delay") || rawStatusText.includes("wet") || rawStatusText.includes("bad light") || rawStatusText.includes("covers")) {
      breakType = BREAK_SUBTYPES.RAIN_DELAY;
      title = "PLAY DELAYED";
      subtitle = "Interrupted by Weather / Conditions";
      badgeText = "RAIN DELAY";
    } else if (rawStatusText.includes("innings") || rawStatusText.includes("inning")) {
      breakType = BREAK_SUBTYPES.INNINGS_BREAK;
      title = "INNINGS BREAK";
      subtitle = "End of 1st Innings";
      badgeText = "INNINGS BREAK";
    } else if (rawStatusText.includes("lunch")) {
      breakType = BREAK_SUBTYPES.LUNCH;
      title = "LUNCH BREAK";
      subtitle = "Day Session Interval";
      badgeText = "LUNCH BREAK";
    } else if (rawStatusText.includes("tea")) {
      breakType = BREAK_SUBTYPES.TEA;
      title = "TEA BREAK";
      subtitle = "Afternoon Session Interval";
      badgeText = "TEA BREAK";
    } else if (rawStatusText.includes("drinks")) {
      breakType = BREAK_SUBTYPES.DRINKS;
      title = "DRINKS BREAK";
      subtitle = "Hydration Interval";
      badgeText = "DRINKS BREAK";
    } else if (rawStatusText.includes("timeout")) {
      breakType = BREAK_SUBTYPES.TIMEOUT;
      title = "STRATEGIC TIMEOUT";
      subtitle = "Tactical Discussion";
      badgeText = "STRATEGIC TIMEOUT";
    } else if (rawStatusText.includes("stumps")) {
      breakType = BREAK_SUBTYPES.STUMPS;
      title = "STUMPS";
      subtitle = "End of Day's Play";
      badgeText = "STUMPS";
    }

    return {
      type: MATCH_STATE_TYPES.BREAK,
      breakType,
      title,
      subtitle,
      badgeText,
      statusText: matchData.statusText || `${title} in progress`,
      isOverride: false
    };
  }

  // 3. Detect COMPLETED
  const completedKeywords = ["won by", "lost by", "won", "finished", "concluded", "drawn", "no result", "abandoned"];
  const isStatusCompleted = ["COMPLETED", "FINISHED", "ABANDONED", "CANCELLED", "RESULT"].includes(rawStatus);
  const hasCompletedText = completedKeywords.some(kw => rawStatusText.includes(kw));

  if (isStatusCompleted || hasCompletedText) {
    return {
      type: MATCH_STATE_TYPES.COMPLETED,
      breakType: null,
      title: "MATCH CONCLUDED",
      subtitle: "Final Result",
      badgeText: "MATCH END",
      statusText: matchData.statusText || "Match Concluded",
      isOverride: false
    };
  }

  // Default: LIVE
  return {
    type: MATCH_STATE_TYPES.LIVE,
    breakType: null,
    title: "LIVE MATCH",
    subtitle: "In Progress",
    badgeText: "LIVE",
    statusText: matchData.statusText || "Match in progress",
    isOverride: false
  };
}
