import type { WebSocketMessage } from "../types";

export const normalizeWebsocketResponse: <T>(e: WebSocketMessage) => T = (
  e,
) => {
  return JSON.parse(e.data);
};
