import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMatch } from "../hooks/useMatch";
import { useBroadcastControl } from "../hooks/useBroadcastControl";
import { ControlHeader } from "../components/control/ControlHeader";
import { LiveMatchSummary } from "../components/control/LiveMatchSummary";
import { DisplayControls } from "../components/control/DisplayControls";
import { LayoutSelector } from "../components/control/LayoutSelector";
import { MediaUploader } from "../components/control/MediaUploader";
import { StadiumUploader } from "../components/control/StadiumUploader";
import { BroadcastUrlBox } from "../components/control/BroadcastUrlBox";
import { BroadcastPreview } from "../components/control/BroadcastPreview";
import { EventLogMonitor } from "../components/control/EventLogMonitor";
import { ToastNotification } from "../components/control/ToastNotification";
import "../styles/control.css";

export function ControlPanel() {
  const { matchId } = useParams();
  const targetId = matchId || "163017";

  const { matchData, connectionStatus, sendMessage, refetch } = useMatch(targetId);
  const { controlState, updateToggle, updateLayout } = useBroadcastControl(targetId, sendMessage);
  const [toastMessage, setToastMessage] = useState("");
  const [eventLogs, setEventLogs] = useState([]);

  const addLog = (label, type = "system") => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEventLogs((prev) => [
      { id: Date.now() + Math.random(), time: timeStr, label, type },
      ...prev.slice(0, 19)
    ]);
  };

  useEffect(() => {
    if (connectionStatus === "connected") {
      addLog(`WebSocket connected to live match stream (${targetId})`, "system");
    } else if (connectionStatus === "reconnecting") {
      addLog(`Connecting to WebSocket server...`, "system");
    }
  }, [connectionStatus, targetId]);

  const handleToggle = (key, value) => {
    updateToggle(key, value);
    addLog(`Toggle '${key}' set to ${value ? "ON" : "OFF"}`, "control");
    setToastMessage("Broadcast updated (Sent to OBS)");
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleLayout = (layoutId) => {
    updateLayout(layoutId);
    addLog(`Layout switched to '${layoutId}' mode`, "control");
    setToastMessage(`Layout set to ${layoutId}`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handlePhotoRefresh = () => {
    addLog("Custom player photo uploaded to Vercel Blob", "media");
    if (refetch) refetch();
  };

  const handleStadiumUpdate = () => {
    addLog("Stadium background image updated on Vercel Blob", "media");
    if (refetch) refetch();
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
            <StadiumUploader onStadiumUpdate={handleStadiumUpdate} />
            <MediaUploader matchData={matchData} onRefresh={handlePhotoRefresh} />
          </div>

          <div className="control-right-column">
            <BroadcastUrlBox matchId={targetId} />
            <BroadcastPreview matchData={matchData} controlState={controlState} matchId={targetId} />
            <EventLogMonitor events={eventLogs} />
          </div>
        </div>
      </main>

      {/* Optimistic Server Confirmation Toast */}
      <ToastNotification message={toastMessage} type="success" />
    </div>
  );
}
