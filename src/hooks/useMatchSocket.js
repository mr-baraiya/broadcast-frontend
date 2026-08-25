import { useEffect, useRef, useState, useCallback } from "react";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:6020";

export function useMatchSocket(matchId, onMessageCallback) {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastUpdateType, setLastUpdateType] = useState(null);
  const [changes, setChanges] = useState([]);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!matchId) return;

    let isUnmounted = false;

    function connect() {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const wsUrl = `${WS_BASE_URL}/ws/match/${matchId}`;
      setConnectionStatus("reconnecting");

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (isUnmounted) return;
          setConnectionStatus("connected");
          retryCountRef.current = 0;
          console.log(`[WS] Connected to live match stream: ${matchId}`);
        };

        ws.onmessage = (event) => {
          if (isUnmounted) return;
          try {
            const data = JSON.parse(event.data);
            setLastUpdateType(data.type);

            if (data.changes && Array.isArray(data.changes)) {
              setChanges(data.changes);
            }

            if (onMessageCallback) {
              onMessageCallback(data);
            }
          } catch (err) {
            console.error("[WS] Error parsing message:", err);
          }
        };

        ws.onerror = (err) => {
          if (isUnmounted) return;
          console.warn(`[WS] Connection error for match ${matchId}:`, err);
        };

        ws.onclose = () => {
          if (isUnmounted) return;
          setConnectionStatus("disconnected");
          socketRef.current = null;

          const backoff = Math.min(1000 * (2 ** retryCountRef.current), 10000);
          retryCountRef.current += 1;
          console.log(`[WS] Reconnecting to ${matchId} in ${backoff}ms...`);
          reconnectTimeoutRef.current = setTimeout(connect, backoff);
        };
      } catch (err) {
        console.error("[WS] Error initializing WebSocket:", err);
      }
    }

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [matchId]);

  const sendMessage = useCallback((jsonMsg) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(jsonMsg));
    }
  }, []);

  return { connectionStatus, lastUpdateType, changes, sendMessage };
}
