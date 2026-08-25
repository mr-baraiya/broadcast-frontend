import React from "react";
import { formatRunRate } from "../utils/formatScore";

export function MatchSituationBar({ matchData }) {
  if (!matchData) return null;

  const { score, sessionInfo, teams, oversTimeline } = matchData;
  const teamA = teams?.teamA || "SRI LANKA";

  const sess = sessionInfo || { session: "Day 3 Session 2" };

  const timeline = oversTimeline || {
    prevOverNum: 82,
    prevOverBalls: [{ label: "0" }, { label: "0" }, { label: "0" }, { label: "W" }, { label: "0" }, { label: "0" }],
    currOverNum: 83,
    currOverBalls: [{ label: "0" }, { label: "0" }, { label: "1" }, { label: "0" }, { label: "0" }, { label: "0" }]
  };

  return (
    <div className="hierarchy-situation-container">
      {/* LEVEL 2 — Match Situation Bar */}
      <div className="level-2-situation-bar">
        <div className="sit-item trail-text">
          {score?.trailBy || `${teamA} trail by 238 runs`}
        </div>

        <div className="sit-divider">•</div>

        <div className="sit-item crr-text">
          CRR <strong className="val-bright">{formatRunRate(score?.crr || 3.17)}</strong>
        </div>

        {score?.partnership && (
          <>
            <div className="sit-divider">•</div>
            <div className="sit-item pship-text">
              <span className="sit-lbl-white">PARTNERSHIP</span>
              <strong className="val-gold">{score.partnership}</strong>
            </div>
          </>
        )}

        <div className="sit-divider">•</div>

        <div className="sit-item session-text">
          {sess.session || "Day 3 Session 2"}
        </div>
      </div>

      {/* LEVEL 3 — Live Information (Recent Overs Strip) */}
      <div className="level-3-live-strip">
        <div className="over-delivery-group">
          <span className="over-title-lbl">LAST OVER</span>
          <div className="ball-boxes-row">
            {timeline.prevOverBalls.map((b, i) => (
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
            {timeline.currOverBalls.map((b, i) => (
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
          <span className="ctx-val yellow">{score?.nextBatsman || "N Dickwella"}</span>
        </div>

        <div className="context-item right">
          <span className="ctx-lbl">Last wicket:</span>
          <span className="ctx-val white">{score?.lastWicket || "Keshara Nuwantha"}</span>
        </div>
      </div>
    </div>
  );
}
