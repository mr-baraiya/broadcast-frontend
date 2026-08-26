import React, { useState, useEffect } from "react";
import { VenueBackground } from "./broadcast/VenueBackground";
import { Scoreboard } from "./Scoreboard";
import { MatchSituationBar } from "./MatchSituationBar";
import { BatsmanCard } from "./BatsmanCard";
import { BowlerCard } from "./BowlerCard";
import { MatchAnalyticsPanel } from "./MatchAnalyticsPanel";
import { BroadcastTicker } from "./broadcast/BroadcastTicker";
import { BroadcastEventOverlay } from "./broadcast/BroadcastEventOverlay";
import { InningsTimeline } from "./InningsTimeline";
import { PreMatchOverlay } from "./broadcast/PreMatchOverlay";
import { MatchBreakOverlay } from "./broadcast/MatchBreakOverlay";
import { getMatchState, MATCH_STATE_TYPES } from "../utils/matchState";

export function BroadcastLayout({ matchData, connectionStatus, animations, controlState, activeEvent }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / targetWidth;
      const scaleY = h / targetHeight;
      const currentScale = Math.min(scaleX, scaleY);
      setScale(currentScale > 0 ? currentScale : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  if (!matchData) return null;

  const stateInfo = getMatchState(matchData, controlState);
  const { teams, players } = matchData;
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
      <div
        className="broadcast-scalable-stage"
        style={{
          width: "1920px",
          height: "1080px",
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          overflow: "hidden"
        }}
      >
        {ctrl.showVenue && <VenueBackground />}

        {/* High-Impact Broadcast Event Overlay Banners (WICKET, SIX, FOUR, MILESTONE) */}
        <BroadcastEventOverlay activeEvent={activeEvent} />

        <div className="broadcast-canvas" style={{ zIndex: 1, width: "100%", height: "100%" }}>
          {/* Top Scoreboard & Situation Stack */}
          {(ctrl.showScoreboard || isScoreOnly) && (
            <div className="broadcast-top-group">
              <Scoreboard matchData={matchData} animScore={animations?.score} stateInfo={stateInfo} />
              {!isScoreOnly && <MatchSituationBar matchData={matchData} stateInfo={stateInfo} />}
            </div>
          )}

          {/* Central Hero Section: State-driven modification */}
          {ctrl.showPlayers && !isScoreOnly && !isCompact && (
            <>
              {stateInfo.type === MATCH_STATE_TYPES.NOT_STARTED ? (
                <PreMatchOverlay matchData={matchData} stateInfo={stateInfo} />
              ) : stateInfo.type === MATCH_STATE_TYPES.BREAK || stateInfo.type === MATCH_STATE_TYPES.COMPLETED ? (
                <MatchBreakOverlay matchData={matchData} stateInfo={stateInfo} />
              ) : (
                <div className="middle-grid">
                  <BatsmanCard batsman={players.striker} teamName={teams.batting} isStriker={true} />
                  <BatsmanCard batsman={players.nonStriker} teamName={teams.batting} isStriker={false} />
                  <BowlerCard bowler={players.bowler} teamName={teams.bowling} />
                </div>
              )}
            </>
          )}

          {/* Low-height Match Context / Analytics Panel */}
          {!isScoreOnly && !isCompact && stateInfo.type === MATCH_STATE_TYPES.LIVE && (
            <MatchAnalyticsPanel matchData={matchData} />
          )}

          {/* Visual Innings Progression Timeline */}
          {!isScoreOnly && !isCompact && stateInfo.type === MATCH_STATE_TYPES.LIVE && (
            <InningsTimeline matchData={matchData} />
          )}
        </div>

        {/* Continuous Infinite Bottom Marquee Ticker */}
        {!isScoreOnly && (
          <div className="bottom-ticker-fixed-wrapper">
            <BroadcastTicker matchData={matchData} />
          </div>
        )}
      </div>
    </div>
  );
}

