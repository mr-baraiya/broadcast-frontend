import React from "react";
import { VenueBackground } from "./broadcast/VenueBackground";
import { Scoreboard } from "./Scoreboard";
import { MatchSituationBar } from "./MatchSituationBar";
import { BatsmanCard } from "./BatsmanCard";
import { BowlerCard } from "./BowlerCard";
import { RecentBalls } from "./RecentBalls";
import { CommentaryTicker } from "./CommentaryTicker";
import { MatchInfoCarousel } from "./broadcast/MatchInfoCarousel";
import { BroadcastTicker } from "./broadcast/BroadcastTicker";
import { BroadcastEventOverlay } from "./broadcast/BroadcastEventOverlay";

export function BroadcastLayout({ matchData, connectionStatus, animations, controlState, activeEvent }) {
  if (!matchData) return null;

  const { teams, players, latestEvent } = matchData;
  const ctrl = controlState || {
    showScoreboard: true,
    showPlayers: true,
    showRecentBalls: true,
    showCommentary: true,
    showVenue: true,
    layout: "DEFAULT"
  };

  const isScoreOnly = ctrl.layout === "SCORE_ONLY";
  const isCompact = ctrl.layout === "COMPACT";

  return (
    <div className={`broadcast-root layout-${ctrl.layout ? ctrl.layout.toLowerCase() : "default"}`}>
      {ctrl.showVenue && <VenueBackground />}

      {/* High-Impact Broadcast Event Overlay Banners (WICKET, SIX, FOUR, MILESTONE) */}
      <BroadcastEventOverlay activeEvent={activeEvent} />

      <div className="broadcast-canvas" style={{ zIndex: 1 }}>
        {/* Top Scoreboard & Situation Stack */}
        {(ctrl.showScoreboard || isScoreOnly) && (
          <div className="broadcast-top-group">
            <Scoreboard matchData={matchData} animScore={animations?.score} />
            {!isScoreOnly && <MatchSituationBar matchData={matchData} />}
          </div>
        )}

        {/* Central Hero Player Cards Section */}
        {ctrl.showPlayers && !isScoreOnly && !isCompact && (
          <div className="middle-grid">
            <BatsmanCard batsman={players.striker} teamName={teams.batting} isStriker={true} />
            <BatsmanCard batsman={players.nonStriker} teamName={teams.batting} isStriker={false} />
            <BowlerCard bowler={players.bowler} teamName={teams.bowling} />
          </div>
        )}

        {/* Bottom Carousel & Timeline Stack */}
        {!isScoreOnly && (
          <div className="broadcast-bottom-group">
            <MatchInfoCarousel matchData={matchData} />

            {ctrl.showRecentBalls && (
              <RecentBalls matchData={matchData} animNewBall={animations?.newBall} />
            )}

            {ctrl.showCommentary && (
              <CommentaryTicker latestEvent={latestEvent} />
            )}
          </div>
        )}
      </div>

      {/* Continuous Infinite Bottom Marquee Ticker */}
      {!isScoreOnly && (
        <div className="bottom-ticker-fixed-wrapper">
          <BroadcastTicker matchData={matchData} />
        </div>
      )}
    </div>
  );
}
