import React from "react";
import { formatRunRate } from "../utils/formatScore";
import { MATCH_STATE_TYPES } from "../utils/matchState";

export function MatchSituationBar({ matchData, stateInfo }) {
  if (!matchData) return null;

  const { score, sessionInfo, teams, oversTimeline, venue } = matchData;
  const teamA = teams?.teamA || "SRI LANKA";

  const sess = sessionInfo || { session: "Day 3 Session 2" };

  const timeline = oversTimeline || {
    prevOverNum: 82,
    prevOverBalls: [{ label: "0" }, { label: "0" }, { label: "0" }, { label: "W" }, { label: "0" }, { label: "0" }],
    currOverNum: 83,
    currOverBalls: [{ label: "0" }, { label: "0" }, { label: "1" }, { label: "0" }, { label: "0" }, { label: "0" }]
  };

  const isNotStarted = stateInfo?.type === MATCH_STATE_TYPES.NOT_STARTED;
  const isBreak = stateInfo?.type === MATCH_STATE_TYPES.BREAK;

  if (isNotStarted) {
    return (
      <div className="hierarchy-situation-container">
        <div className="level-2-situation-bar" style={{ justifyContent: "center" }}>
          <div className="sit-item trail-text">
            {matchData.title || `${teamA} vs ${teams?.teamB || "TEAM B"}`}
          </div>
          <div className="sit-divider">•</div>
          <div className="sit-item crr-text">
            VENUE: <strong className="val-bright">{venue || "Premadasa Stadium"}</strong>
          </div>
          <div className="sit-divider">•</div>
          <div className="sit-item pship-text">
            <span className="sit-lbl-white">STATUS:</span>
            <strong className="val-gold">{stateInfo?.statusText || "Match Starts Soon"}</strong>
          </div>
        </div>
      </div>
    );
  }

  if (isBreak) {
    return (
      <div className="hierarchy-situation-container">
        <div className="level-2-situation-bar" style={{ justifyContent: "center" }}>
          <div className="sit-item trail-text" style={{ color: "#facc15", fontWeight: 800 }}>
            {stateInfo?.title || "MATCH BREAK"}
          </div>
          <div className="sit-divider">•</div>
          <div className="sit-item crr-text">
            {stateInfo?.statusText || "Play paused"}
          </div>
          {score?.target && (
            <>
              <div className="sit-divider">•</div>
              <div className="sit-item pship-text">
                <span className="sit-lbl-white">TARGET</span>
                <strong className="val-gold">{score.target} RUNS</strong>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hierarchy-situation-container">
      {/* LEVEL 2 — Match Situation Bar */}
      <div className="level-2-situation-bar">
        <div className="sit-item trail-text">
          {score?.trailBy || matchData.statusText || `${teamA} In Progress`}
        </div>

        {score?.crr && (
          <>
            <div className="sit-divider">•</div>
            <div className="sit-item crr-text">
              CRR <strong className="val-bright">{formatRunRate(score.crr)}</strong>
            </div>
          </>
        )}

        {score?.partnership && (
          <>
            <div className="sit-divider">•</div>
            <div className="sit-item pship-text">
              <span className="sit-lbl-white">PARTNERSHIP</span>
              <strong className="val-gold">{score.partnership}</strong>
            </div>
          </>
        )}

        {sess?.session && (
          <>
            <div className="sit-divider">•</div>
            <div className="sit-item session-text">
              {sess.session}
            </div>
          </>
        )}
      </div>

      {/* LEVEL 3 — Live Information (Recent Overs Strip) */}
      <div className="level-3-live-strip">
        <div className="over-delivery-group">
          <span className="over-title-lbl">LAST OVER</span>
          <div className="ball-boxes-row">
            {(timeline.prevOverBalls || []).map((b, i) => (
              <span key={i} className={`ball-box-sq ${b.label === "W" ? "wicket" : b.label === "6" ? "six" : b.label === "4" ? "four" : ""}`}>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        <div className="strip-center-separator"></div>

        <div className="over-delivery-group">
          <span className="over-title-lbl">CURRENT OVER</span>
          <div className="ball-boxes-row">
            {(timeline.currOverBalls || []).map((b, i) => (
              <span key={i} className={`ball-box-sq ${b.label === "W" ? "wicket" : b.label === "6" ? "six" : b.label === "4" ? "four" : ""}`}>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* LEVEL 4 — Player Context Strip */}
      <div className="level-4-player-context-strip">
        <div className="context-item left">
          <span className="ctx-lbl">Next batsman:</span>
          <span className="ctx-val yellow">{score?.nextBatsman || "N/A"}</span>
        </div>

        <div className="context-item right">
          <span className="ctx-lbl">Last wicket:</span>
          <span className="ctx-val white">{score?.lastWicket || "None"}</span>
        </div>
      </div>
    </div>
  );
}

