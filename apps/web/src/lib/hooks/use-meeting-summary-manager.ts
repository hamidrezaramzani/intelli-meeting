/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { normalizeWebsocketResponse, useWebSocket } from "@/lib";
import { useReadMeetingSummariesQuery } from "@/services";

export type MeetingSummary =
  | {
      summary?: string;
      key_points?: string[];
    }
  | undefined;

export type MeetingDecision =
  | {
      description?: string;
      decided_by?: string;
    }[]
  | undefined;

export type MeetingAction =
  | {
      description?: string;
      owner?: string;
      deadline?: string;
    }[]
  | undefined;

interface SummaryState {
  summary?: MeetingSummary;
  decisions?: MeetingDecision;
  actions?: MeetingAction;
  isLoading: boolean;
  isEmptyFromDB: boolean;
}

export const useMeetingSummaryManager = (meetingId?: string) => {
  const { connect } = useWebSocket();

  const { data: meetingSummaries, isFetching } = useReadMeetingSummariesQuery(
    meetingId ? { meetingId } : skipToken
  );

  const [state, setState] = useState<SummaryState>({
    summary: undefined,
    decisions: undefined,
    actions: undefined,
    isLoading: false,
    isEmptyFromDB: false,
  });

  useEffect(() => {
    if (meetingSummaries === undefined) {
      setState({
        isLoading: false,
        isEmptyFromDB: true,
      });
    } else if (meetingSummaries.empty) {
      setState({
        summary: undefined,
        decisions: undefined,
        actions: undefined,
        isLoading: false,
        isEmptyFromDB: true,
      });
    } else if (!meetingSummaries.empty && meetingSummaries.isGenerating) {
      setState({
        summary: meetingSummaries.summary,
        decisions: meetingSummaries.decisions,
        actions: meetingSummaries.actions,
        isLoading: true,
        isEmptyFromDB: true,
      });

      startWebSocketProcessing(true);
    } else {
      setState({
        summary: meetingSummaries.summary,
        decisions: meetingSummaries.decisions,
        actions: meetingSummaries.actions,
        isLoading: false,
        isEmptyFromDB: false,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingSummaries]);

  const resetState = useCallback((isFailed = true) => {
    setState({
      summary: undefined,
      decisions: undefined,
      actions: undefined,
      isLoading: isFailed,
      isEmptyFromDB: true,
    });
    if (isFailed) toast.error("We have an error generating meeting summary");
  }, []);

  const startWebSocketProcessing = useCallback((reconnect: boolean = false) => {
    if (!meetingId) return;
    const path = `/meeting/generate-summary?meeting_id=${meetingId}${reconnect ? "&reconnect=true" : "&reconnect=false"}`;

    connect(
      path,
      (event) => {
        try {
          const message = normalizeWebsocketResponse<{
            type: string;
            data: any;
          }>(event);

          setState((prev) => {
            const newState = { ...prev };
            if (message.type === "summary")
              newState.summary = message.data.summary;
            if (message.type === "decisions")
              newState.decisions = message.data.decisions;
            if (message.type === "actions")
              newState.actions = message.data.actions;
            if (message.type === "done") {
              newState.isLoading = false;
              newState.isEmptyFromDB = false;
              toast.success("Meeting summary generated successfully");
            }
            return newState;
          });
        } catch (e) {
          console.error(e);
          resetState();
        }
      },
      () => resetState(false)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateAgain = () => {
    resetState(false);
    setState((prev) => ({ ...prev, isLoading: true }));
    startWebSocketProcessing();
  };

  return {
    ...state,
    isFetching,
    generateAgain,
  };
};
