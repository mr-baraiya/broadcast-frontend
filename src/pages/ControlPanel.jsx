import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMatch } from "../hooks/useMatch";
import { useBroadcastControl } from "../hooks/useBroadcastControl";
import { ControlHeader } from "../components/control/ControlHeader";
import { LiveMatchSummary } from "../components/control/LiveMatchSummary";
import { DisplayControls } from "../components/control/DisplayControls";
import { LayoutSelector } from "../components/control/LayoutSelector";
import { BroadcastUrlBox } from "../components/control/BroadcastUrlBox";
import { BroadcastPreview } from "../components/control/BroadcastPreview";
import { EventLogMonitor } from "../components/control/EventLogMonitor";
import { ToastNotification } from "../components/control/ToastNotification";
import "../styles/control.css";

export function ControlPanel() {
  const { matchId } = useParams();
  const targetId = matchId || "163017";

  const { matchData, connectionStatus, sendMessage } = useMatch(targetId);
  const { controlState, updateToggle, updateLayout } = useBroadcastControl(targetId, sendMessage);
  const [toastMessage, setToastMessage] = useState("");

  const handleToggle = (key, value) => {
    updateToggle(key, value);
    setToastMessage("✓ Broadcast updated (Sent to OBS)");
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleLayout = (layoutId) => {
    updateLayout(layoutId);
    setToastMessage(`✓ Layout set to ${layoutId}`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const matchTitle = matchData ? matchData.title : `Match ${targetId}`;

  return (
    <div className="control-root-layout">
      <ControlHeader matchTitle={matchTitle} matchId={targetId} connectionStatus={connectionStatus} />

      <main className="control-main-container">
        {/* Read-Only Operator Live Match Context Summary */}
        <LiveMatchSummary matchData={matchData} />

        <div className="control-grid-layout">
          <div className="control-left-column">
            <DisplayControls controlState={controlState} onToggleChange={handleToggle} />
            <LayoutSelector currentLayout={controlState.layout} onLayoutChange={handleLayout} />
          </div>

          <div className="control-right-column">
            <BroadcastUrlBox matchId={targetId} />
            <BroadcastPreview matchData={matchData} controlState={controlState} matchId={targetId} />
            <EventLogMonitor />
          </div>
        </div>
      </main>

      {/* Optimistic Server Confirmation Toast */}
      <ToastNotification message={toastMessage} type="success" />
    </div>
  );
}
