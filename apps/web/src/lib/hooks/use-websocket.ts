import { useRef, useState } from "react";

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = (path: string, onMessage?: (msg: MessageEvent) => void) => {
    if (wsRef.current) wsRef.current.close();

    const url = `${process.env.NEXT_PUBLIC_WS_URL}${path}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("🔗 WebSocket connected");
    };

    ws.onmessage = (event) => {
      if (onMessage) onMessage(event);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("❌ WebSocket disconnected");
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
  };

  const sendMessage = (msg: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    }
  };

  const disconnect = () => {
    wsRef.current?.close();
  };

  return { isConnected, connect, sendMessage, disconnect };
};
