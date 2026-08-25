import { useState, useEffect, useCallback } from "react";
import { getMatchFull } from "../services/api";
import { normalizeMatchData } from "../utils/normalizeMatch";
import { useMatchSocket } from "./useMatchSocket";

const DEFAULT_CONTROL = {
  showScoreboard: true,
  showPlayers: true,
  showRecentBalls: true,
  showCommentary: true,
  showVenue: true,
  layout: "DEFAULT"
};

export function useMatch(matchId) {
  const [matchData, setMatchData] = useState(null);
  const [controlState, setControlState] = useState(DEFAULT_CONTROL);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggerScoreAnim, setTriggerScoreAnim] = useState(false);
  const [triggerWicketAnim, setTriggerWicketAnim] = useState(false);
  const [triggerNewBallAnim, setTriggerNewBallAnim] = useState(false);

  // Initial REST Snapshot fetch
  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;
    setIsLoading(true);

    getMatchFull(matchId)
      .then((raw) => {
        if (isMounted) {
          const normalized = normalizeMatchData(raw);
          setMatchData(normalized);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [matchId]);

  // Handle incoming WebSocket messages
  const handleSocketMessage = useCallback((wsPayload) => {
    if (!wsPayload) return;

    if (wsPayload.type === "broadcast_state" && wsPayload.data) {
      setControlState((prev) => ({ ...prev, ...wsPayload.data }));
      return;
    }

    if (wsPayload.control) {
      setControlState((prev) => ({ ...prev, ...wsPayload.control }));
    }

    if (wsPayload.type === "match_snapshot" || wsPayload.type === "match_update") {
      const newNormalized = normalizeMatchData(wsPayload.data || wsPayload);
      if (!newNormalized) return;

      setMatchData((prev) => {
        if (!prev) return newNormalized;

        if (newNormalized.score.runs !== prev.score.runs) {
          setTriggerScoreAnim(true);
          setTimeout(() => setTriggerScoreAnim(false), 500);
        }

        if (newNormalized.score.wickets !== prev.score.wickets) {
          setTriggerWicketAnim(true);
          setTimeout(() => setTriggerWicketAnim(false), 800);
        }

        if (
          newNormalized.latestEvent &&
          (!prev.latestEvent || newNormalized.latestEvent.event_id !== prev.latestEvent.event_id)
        ) {
          setTriggerNewBallAnim(true);
          setTimeout(() => setTriggerNewBallAnim(false), 400);
        }

        return newNormalized;
      });
    } else if (wsPayload.type === "match_end") {
      setMatchData((prev) => prev ? { ...prev, status: "COMPLETED", statusText: "Match Concluded" } : prev);
    }
  }, []);

  const { connectionStatus, changes, sendMessage } = useMatchSocket(matchId, handleSocketMessage);

  return {
    matchData,
    controlState,
    setControlState,
    isLoading,
    error,
    connectionStatus,
    changes,
    sendMessage,
    animations: {
      score: triggerScoreAnim,
      wicket: triggerWicketAnim,
      newBall: triggerNewBallAnim
    }
  };
}
