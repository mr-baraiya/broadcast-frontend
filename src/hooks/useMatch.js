import { useState, useEffect, useCallback } from "react";
import { getMatchFull, getMatchControl } from "../services/api";
import { normalizeMatchData } from "../utils/normalizeMatch";
import { useMatchSocket } from "./useMatchSocket";
import { subscribeRegistryUpdate } from "../utils/teamLogos";

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

  // Initial REST Snapshot & Control State fetch
  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;
    setIsLoading(true);

    // Fetch control state
    getMatchControl(matchId).then((res) => {
      if (isMounted && res && res.control) {
        setControlState((prev) => ({ ...prev, ...res.control }));
      }
    }).catch(() => {});

    // Fetch full match data
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

  // Automatic Real-Time Auto-Update Polling Interval (every 3 seconds)
  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;

    const pollLiveScores = () => {
      getMatchFull(matchId)
        .then((raw) => {
          if (isMounted) {
            const normalized = normalizeMatchData(raw);
            if (normalized) {
              setMatchData(normalized);
            }
          }
        })
        .catch(() => {});
    };

    const intervalId = setInterval(pollLiveScores, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [matchId]);

  // Subscribe to teamLogos registry updates
  useEffect(() => {
    const unsub = subscribeRegistryUpdate(() => {
      setMatchData((prev) => (prev ? { ...prev } : prev));
    });
    return unsub;
  }, []);

  // Handle incoming WebSocket messages
  const handleSocketMessage = useCallback((wsPayload) => {
    if (!wsPayload) return;

    console.log("[useMatch WS Message]", wsPayload.type, wsPayload);

    if (wsPayload.type === "broadcast_state") {
      const stateData = wsPayload.data || wsPayload.control;
      if (stateData) {
        console.log("[useMatch Control State Update]", stateData);
        setControlState((prev) => ({ ...prev, ...stateData }));
      }
      return;
    }

    if (wsPayload.control) {
      console.log("[useMatch Control State from payload]", wsPayload.control);
      setControlState((prev) => ({ ...prev, ...wsPayload.control }));
    }

    if (wsPayload.type === "match_snapshot" || wsPayload.type === "match_update" || wsPayload.type === "media_update") {
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

  const refetch = useCallback(() => {
    if (!matchId) return;
    getMatchFull(matchId).then((raw) => {
      const normalized = normalizeMatchData(raw);
      setMatchData(normalized);
    }).catch(() => {});
  }, [matchId]);

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
    refetch,
    animations: {
      score: triggerScoreAnim,
      wicket: triggerWicketAnim,
      newBall: triggerNewBallAnim
    }
  };
}
