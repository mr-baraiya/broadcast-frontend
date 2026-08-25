import { useState, useEffect, useCallback } from "react";
import { getMatchControl, updateMatchControl } from "../services/api";

const DEFAULT_CONTROL = {
  showScoreboard: true,
  showPlayers: true,
  showRecentBalls: true,
  showCommentary: true,
  showVenue: true,
  layout: "DEFAULT"
};

export function useBroadcastControl(matchId, socketSendFunc = null) {
  const [controlState, setControlState] = useState(DEFAULT_CONTROL);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial control state on mount
  useEffect(() => {
    if (!matchId) return;

    getMatchControl(matchId).then((res) => {
      if (res && res.control) {
        setControlState((prev) => ({ ...prev, ...res.control }));
      }
    });
  }, [matchId]);

  // Update control toggle
  const updateToggle = useCallback((key, value) => {
    setControlState((prev) => {
      const updated = { ...prev, [key]: value };
      console.log(`[useBroadcastControl] Updating toggle ${key} -> ${value}`, updated);

      // Save via REST API
      setIsSaving(true);
      updateMatchControl(matchId, updated)
        .then((res) => console.log("[useBroadcastControl REST POST success]", res))
        .catch((err) => console.warn("[useBroadcastControl REST POST error]", err))
        .finally(() => setIsSaving(false));

      // Dispatch WebSocket state update
      if (socketSendFunc) {
        try {
          console.log("[useBroadcastControl WS dispatch]", updated);
          socketSendFunc({
            type: "broadcast_state",
            match_id: matchId,
            data: updated
          });
        } catch (err) {
          console.warn("[Control] Failed to send WS state message:", err);
        }
      }

      return updated;
    });
  }, [matchId, socketSendFunc]);

  // Update layout mode
  const updateLayout = useCallback((layoutMode) => {
    updateToggle("layout", layoutMode);
  }, [updateToggle]);

  return {
    controlState,
    setControlState,
    updateToggle,
    updateLayout,
    isSaving
  };
}
