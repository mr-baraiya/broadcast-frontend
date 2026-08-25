import React from "react";
import { getDeliveryStyle } from "../utils/colorUtils";

export function RecentBalls({ matchData, animNewBall = false }) {
  const overs = matchData?.oversTimeline || {
    prevOverNum: 43,
    prevOverBalls: [
      { label: "0", runs: 0, event: "DOT" },
      { label: "0", runs: 0, event: "DOT" },
      { label: "0", runs: 0, event: "DOT" },
      { label: "1", runs: 1, event: "SINGLE" },
      { label: "0", runs: 0, event: "DOT" },
      { label: "1", runs: 1, event: "SINGLE" }
    ],
    prevOverTotal: 2,
    currOverNum: 44,
    currOverBalls: [
      { label: "1", runs: 1, event: "SINGLE" },
      { label: "1", runs: 1, event: "SINGLE" }
    ],
    currOverTotal: 2
  };

  const renderOverBoxes = (balls, maxCount = 6, animLatest = false) => {
    const boxes = [];
    for (let i = 0; i < maxCount; i++) {
      const item = balls[i];
      if (item) {
        const style = getDeliveryStyle(item.event, item.runs);
        const isLatest = i === balls.length - 1;

        boxes.push(
          <div
            key={i}
            className={`ref-ball-box ${isLatest && animLatest ? "animate-pill-enter" : ""}`}
            style={{
              background: style.bg,
              color: style.color,
              border: style.border
            }}
          >
            {item.label || "0"}
          </div>
        );
      } else {
        boxes.push(<div key={i} className="ref-ball-box empty" />);
      }
    }
    return boxes;
  };

  return (
    <div className="ref-recent-bar">
      {/* Magenta RECENT Badge */}
      <div className="ref-recent-badge">
        <span>RECENT</span>
        <span className="recent-dot" />
      </div>

      {/* OVER A (e.g. OVER 43) */}
      <div className="ref-over-group">
        <span className="over-label">OVER {overs.prevOverNum}:</span>
        <div className="over-boxes-row">
          {renderOverBoxes(overs.prevOverBalls, 6, false)}
        </div>
        <span className="over-total">= {overs.prevOverTotal}</span>
      </div>

      {/* OVER B (e.g. OVER 44) */}
      <div className="ref-over-group">
        <span className="over-label">OVER {overs.currOverNum}:</span>
        <div className="over-boxes-row">
          {renderOverBoxes(overs.currOverBalls, 6, animNewBall)}
        </div>
        <span className="over-total">= {overs.currOverTotal}</span>
      </div>
    </div>
  );
}
