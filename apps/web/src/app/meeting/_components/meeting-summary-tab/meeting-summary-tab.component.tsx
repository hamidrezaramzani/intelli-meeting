/* eslint-disable max-lines-per-function */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { Button } from "@intelli-meeting/shared-ui";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useReadMeetingSummariesQuery } from "@/services";

import type {
  MeetingAction,
  MeetingDecision,
  MeetingSummary,
  MeetingSummaryTabProps,
} from "./meeting-summary-tab.type";

export const MeetingSummaryTab = ({ meetingId }: MeetingSummaryTabProps) => {
  const {
    data: meetingSummaries,
    isLoading: isMeetingSummariesLoading,
    isSuccess: isMeetingSummariesSuccess,
  } = useReadMeetingSummariesQuery(meetingId ? { meetingId } : skipToken);
  const [summaryData, setSummaryData] = useState<MeetingSummary>();

  const [decisionsData, setDecisionsData] = useState<MeetingDecision>();

  const [actionsData, setActionsData] = useState<MeetingAction>();

  const [isGeneratingSummariesLoading, setGeneratingSummariesLoading] =
    useState(false);

  useEffect(() => {
    if (meetingSummaries && !meetingSummaries?.empty) {
      setSummaryData(meetingSummaries.summary);
      setDecisionsData(meetingSummaries.decisions);
      setActionsData(meetingSummaries.actions);
    }
  }, [meetingSummaries]);

  const handleGenerateMeetingSummary = async () => {
    setSummaryData(undefined);
    setDecisionsData(undefined);
    setActionsData(undefined);
    setGeneratingSummariesLoading(true);
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/meeting/generate-summary?meeting_id=${meetingId}`,
    );

    const listener = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "summary") {
          setSummaryData(message.data.summary);
        }

        if (message.type === "decisions") {
          setDecisionsData(message.data.decisions);
        }

        if (message.type === "actions") {
          setActionsData(message.data.actions);
        }

        if (message.type === "done") {
          setGeneratingSummariesLoading(true);
          toast.success("Generating meeting summary completed succesfully");
        }
      } catch (e) {
        toast.error("We have an error to generate meeting summary");
        console.error("Failed to parse message", e);
      }
    };

    ws.addEventListener("message", listener);

    ws.addEventListener("open", () => console.log("WebSocket opened"));
    ws.addEventListener("close", () => {
      setGeneratingSummariesLoading(false);
    });
    ws.addEventListener("error", (err) => {
      console.error(err);
      setGeneratingSummariesLoading(false);
      toast.error("We have an error to generate meeting summary");
    });
  };

  const MeetingSummariesSkeleton = (
    <div className="space-y-2.5 mt-4 animate-pulse max-w-lg" role="status">
      <div className="flex items-center w-full">
        <div className="h-2.5 bg-slate-300 rounded-full w-32"></div>
        <div className="h-2.5 ms-2 bg-slate-300 rounded-full w-24"></div>
        <div className="h-2.5 ms-2 bg-slate-300 rounded-full w-full"></div>
      </div>
      <div className="flex items-center w-full">
        <div className="h-2.5 bg-slate-300 rounded-full w-32"></div>
        <div className="h-2.5 ms-2 bg-slate-300 rounded-full w-24"></div>
        <div className="h-2.5 ms-2 bg-slate-300 rounded-full w-full"></div>
      </div>
      <div className="flex items-center w-full">
        <div className="h-2.5 bg-slate-300 rounded-full w-32"></div>
        <div className="h-2.5 ms-2 bg-slate-300 rounded-full w-24"></div>
        <div className="h-2.5 ms-2 bg-slate-300 rounded-full w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      {meetingSummaries &&
      meetingSummaries.empty &&
      !isGeneratingSummariesLoading ? (
        <div className="w-full h-96 bg-slate-100 flex flex-col justify-center items-center rounded-md">
          <div className="flex flex-col items-center gap-1 mb-3">
            <h1 className="text-lg text-slate-700">No Summary Available</h1>
            <p className="text-sm text-slate-500">
              There are no notes or action items recorded for this session yet
            </p>
          </div>
          <Button
            fullWidth={false}
            isLoading={isGeneratingSummariesLoading}
            onClick={handleGenerateMeetingSummary}
          >
            Generate summaries
          </Button>
        </div>
      ) : (
        <>
          <section className="bg-white p-4 rounded-lg">
            <div className="w-full flex mb-5 items-center justify-between">
              <h3 className="text-lg font-bold mb-2 text-slate-800">Summary</h3>
              <Button
                fullWidth={false}
                isLoading={isGeneratingSummariesLoading}
                onClick={handleGenerateMeetingSummary}
              >
                Generate Again
              </Button>
            </div>

            <p className="text-sm text-slate-600">{summaryData?.summary}</p>

            <ul className="list-disc pl-6 mt-3 text-sm">
              {summaryData?.key_points?.map((point, i) => (
                <li className="text-slate-600" key={i}>
                  {point}
                </li>
              )) || []}
            </ul>
            {isGeneratingSummariesLoading && MeetingSummariesSkeleton}
          </section>

          <section className="p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-slate-800">Decisions</h3>

            <ul className="text-sm flex flex-col">
              {decisionsData?.map((decision, i) => (
                <li
                  className="px-3 py-2 rounded-md flex justify-between items-center"
                  key={i}
                >
                  <span className="text-slate-600">{decision.description}</span>
                  <span className="text-xs text-slate-500">
                    decided by: {decision.decided_by || "Unknown"}
                  </span>
                </li>
              ))}
            </ul>
            {isGeneratingSummariesLoading && MeetingSummariesSkeleton}
          </section>

          <section className="p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-slate-800">Actions</h3>

            <ul className="text-sm flex flex-col">
              {actionsData?.map((a, i) => (
                <li
                  className="text-slate-700 px-3 py-2 rounded-md flex flex-col gap-1"
                  key={i}
                >
                  <span>{a.description}</span>
                  <div className="text-xs text-slate-400 flex justify-between">
                    <span>owner: {a.owner || "Unknown"}</span>
                    <span>deadline: {a.deadline || "None"}</span>
                  </div>
                </li>
              ))}
            </ul>
            {isGeneratingSummariesLoading && MeetingSummariesSkeleton}
          </section>
        </>
      )}
    </div>
  );
};
