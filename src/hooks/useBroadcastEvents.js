import { useState, useEffect, useRef } from "react";
import { detectBroadcastEvent } from "../utils/eventDetector";

export function useBroadcastEvents(matchData) {
  const [activeEvent, setActiveEvent] = useState(null);
  const prevMatchRef = useRef(null);
  const dismissTimeoutRef = useRef(null);

  useEffect(() => {
    if (!matchData) return;

    const prevMatch = prevMatchRef.current;
    prevMatchRef.current = matchData;

    if (!prevMatch) return;

    const detected = detectBroadcastEvent(prevMatch, matchData);

    if (detected) {
      // Check priority vs currently active event
      if (!activeEvent || detected.priority <= activeEvent.priority) {
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
        }

        setActiveEvent(detected);

        dismissTimeoutRef.current = setTimeout(() => {
          setActiveEvent(null);
        }, detected.duration || 1200);
      }
    }
  }, [matchData]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, []);

  return { activeEvent, setActiveEvent };
}
