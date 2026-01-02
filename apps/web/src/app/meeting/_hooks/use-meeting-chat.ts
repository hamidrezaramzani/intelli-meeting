/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable max-lines-per-function */
import { useAppSelector } from "@intelli-meeting/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { normalizeWebsocketResponse, useWebSocket } from "@/lib";
import {
  useReadMeetingChatHistoryQuery,
  type MeetingChatMessage,
} from "@/services";

interface MeetingChatState {
  messages: MeetingChatMessage[];
  isProcessing: boolean;
  isLoading: boolean;
  permissionError: boolean;
  connectionError?: string;
}

export const useMeetingChat = (meetingId?: string) => {
  const { connect, send, isConnected } = useWebSocket();
  const tokenFromStore = useAppSelector((state) => state.auth.token);
  const token = useMemo(
    () =>
      tokenFromStore ||
      (typeof window !== "undefined"
        ? localStorage.getItem("token") || ""
        : ""),
    [tokenFromStore]
  );

  const {
    data: history,
    error: historyError,
    isFetching,
    refetch,
  } = useReadMeetingChatHistoryQuery(meetingId ? { meetingId } : skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const [state, setState] = useState<MeetingChatState>({
    messages: [],
    isProcessing: false,
    isLoading: false,
    permissionError: false,
  });
  const [inputValue, setInputValue] = useState("");
  const processingPollRef = useRef<NodeJS.Timeout | null>(null);

  const updateProcessingPoll = useCallback(
    (processing: boolean) => {
      if (processingPollRef.current) {
        clearInterval(processingPollRef.current);
        processingPollRef.current = null;
      }
      if (processing && meetingId) {
        processingPollRef.current = setInterval(() => {
          refetch();
        }, 4000);
      }
    },
    [meetingId, refetch]
  );

  useEffect(() => {
    if (history) {
      setState((prev) => ({
        ...prev,
        messages: history.messages || [],
        isProcessing: history.isProcessing,
        permissionError: false,
        connectionError: undefined,
      }));
      updateProcessingPoll(history.isProcessing);
    }
  }, [history, updateProcessingPoll]);

  useEffect(() => {
    if (historyError && "status" in historyError) {
      const statusCode = historyError.status as number;
      setState((prev) => ({
        ...prev,
        permissionError: statusCode === 403,
        connectionError: statusCode === 403 ? undefined : "history_error",
      }));
    }
  }, [historyError]);

  useEffect(() => {
    if (!meetingId || !token || state.permissionError) return;
    const path = `/meeting/${meetingId}/chat?token=${token}`;
    connect(
      path,
      (event) => {
        const payload = normalizeWebsocketResponse<{
          type: string;
          state?: string;
          text?: string;
          code?: string | null;
          message?: string;
        }>(event);

        if (payload.type === "status") {
          const isProcessing = payload.state === "processing";
          setState((prev) => ({
            ...prev,
            isProcessing,
            connectionError: undefined,
          }));
          updateProcessingPoll(isProcessing);
        }

        if (payload.type === "assistant_message" && payload.text) {
          setState((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: Date.now(),
                role: "assistant",
                content: payload.text,
                message_code: payload.code,
                created_at: new Date().toISOString(),
              },
            ],
            isProcessing: false,
            connectionError: undefined,
          }));
          updateProcessingPoll(false);
          refetch();
        }

        if (payload.type === "error") {
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            connectionError: payload.message || "unknown_error",
          }));
          updateProcessingPoll(false);
        }
      },
      () =>
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          connectionError: "connection_failed",
        }))
    );
  }, [
    connect,
    meetingId,
    refetch,
    state.permissionError,
    token,
    updateProcessingPoll,
  ]);

  useEffect(() => {
    if (isConnected && meetingId) {
      refetch();
    }
  }, [isConnected, meetingId, refetch]);

  useEffect(() => {
    return () => {
      if (processingPollRef.current) {
        clearInterval(processingPollRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (!meetingId || !token || state.permissionError) return;
    const trimmed = inputValue.trim();
    if (!trimmed || state.isProcessing) return;

    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: Date.now(),
          role: "user",
          content: trimmed,
          created_at: new Date().toISOString(),
        },
      ],
      isProcessing: true,
      connectionError: undefined,
    }));
    setInputValue("");

    send({
      type: "user_message",
      meeting_id: meetingId,
      text: trimmed,
    });
    updateProcessingPoll(true);
  }, [
    meetingId,
    token,
    state.permissionError,
    state.isProcessing,
    inputValue,
    send,
    updateProcessingPoll,
  ]);

  return {
    ...state,
    inputValue,
    isConnected,
    isHistoryLoading: isFetching,
    setInputValue,
    sendMessage,
    refetchHistory: refetch,
  };
};
