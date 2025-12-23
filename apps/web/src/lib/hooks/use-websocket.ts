/* eslint-disable max-params */
/* eslint-disable react-hooks/immutability */
import { useRef, useState, useCallback, useEffect } from "react";

interface ConnectionParams {
  path: string;
  onMessage?: (msg: MessageEvent) => void;
  onError?: (msg: Event) => void;
}

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const paramsRef = useRef<ConnectionParams | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const createConnection = useCallback(
    (
      path: string,
      onMessage?: (msg: MessageEvent) => void,
      onError?: (msg: Event) => void,
      isReconnecting = false,
    ) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.warn("Connection already open.");
        return;
      }

      if (!isReconnecting) {
        paramsRef.current = { path, onMessage, onError };
        reconnectAttemptsRef.current = 0;
      }

      const url = `${process.env.NEXT_PUBLIC_WS_URL}${path}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        console.info("WebSocket connected successfully");
      };

      ws.onmessage = (event) => {
        if (paramsRef.current?.onMessage) {
          paramsRef.current.onMessage(event);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.info("WebSocket disconnected. Attempting reconnect...");

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          reconnectTimerRef.current = setTimeout(() => {
            const params = paramsRef.current;
            if (params) {
              console.info(
                `Attempting reconnect #${reconnectAttemptsRef.current}`,
              );
              createConnection(
                params.path,
                params.onMessage,
                params.onError,
                true,
              );
            }
          }, RECONNECT_DELAY);
        } else {
          console.error("Max reconnect attempts reached. Giving up.");
          wsRef.current = null;
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        if (paramsRef.current?.onError) {
          paramsRef.current.onError(err);
        }
        ws.close();
      };
    },
    [],
  );

  const connect = useCallback(
    (...args: Parameters<typeof createConnection>) => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      createConnection(...args);
    },
    [createConnection],
  );

  useEffect(() => {
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      wsRef.current?.close();
    };
  }, []);

  return { isConnected, connect };
};
