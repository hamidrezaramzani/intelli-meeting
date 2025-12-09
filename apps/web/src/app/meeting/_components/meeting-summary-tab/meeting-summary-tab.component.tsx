import { Button, EmptyState } from "@intelli-meeting/shared-ui";
import React from "react";

import { useMeetingSummaryManager } from "@/lib";

import type { MeetingSummaryTabProps } from "./meeting-summary-tab.type";

export const MeetingSummaryTab = ({ meetingId }: MeetingSummaryTabProps) => {
  const {
    generateAgain,
    isEmptyFromDB,
    isLoading,
    actions,
    decisions,
    summary,
  } = useMeetingSummaryManager(meetingId);

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
    <div className="flex flex-col gap-6">
      {isEmptyFromDB && !isLoading ? (
        <EmptyState
          title="No summary available"
          actionLabel="Generate"
          description="There are no notes or action items recorded for this session yet"
          onAction={generateAgain}
        />
      ) : (
        <>
          <section className="bg-white p-4 rounded-lg">
            <div className="w-full flex mb-5 items-center justify-between">
              <h3 className="text-lg font-bold mb-2 text-slate-800">Summary</h3>
              {!isLoading ? (
                <Button
                  fullWidth={false}
                  isLoading={isLoading}
                  onClick={generateAgain}
                >
                  Generate Again
                </Button>
              ) : (
                <Button fullWidth={false} variant="primary">
                  Cancel generating
                </Button>
              )}
            </div>

            <p className="text-sm text-slate-600">{summary?.summary}</p>

            <ul className="list-disc pl-6 mt-3 text-sm">
              {summary?.key_points?.map((point, i) => (
                <li className="text-slate-600" key={i}>
                  {point}
                </li>
              )) || []}
            </ul>
            {isLoading && MeetingSummariesSkeleton}
          </section>

          <section className="p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-slate-800">Decisions</h3>

            <ul className="text-sm flex flex-col">
              {decisions?.map((decision, i) => (
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
            {isLoading && MeetingSummariesSkeleton}
          </section>

          <section className="p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-slate-800">Actions</h3>

            <ul className="text-sm flex flex-col">
              {actions?.map((action, i) => (
                <li
                  className="text-slate-700 px-3 py-2 rounded-md flex flex-col gap-1"
                  key={i}
                >
                  <span>{action.description}</span>
                  <div className="text-xs text-slate-400 flex justify-between">
                    <span>owner: {action.owner || "Unknown"}</span>
                    <span>deadline: {action.deadline || "None"}</span>
                  </div>
                </li>
              ))}
            </ul>
            {isLoading && MeetingSummariesSkeleton}
          </section>
        </>
      )}
    </div>
  );
};
