import { Button, EmptyState } from "@intelli-meeting/shared-ui";
import React from "react";
import { useTranslation } from "react-i18next";

import { useMeetingSummaryManager } from "@/lib";

import type { MeetingSummaryTabProps } from "./meeting-summary-tab.type";

export const MeetingSummaryTab = ({ meetingId }: MeetingSummaryTabProps) => {
  const { t } = useTranslation();
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
          title={t("meeting:summary.emptyTitle")}
          actionLabel={t("meeting:summary.generate")}
          description={t("meeting:summary.emptyDescription")}
          onAction={generateAgain}
        />
      ) : (
        <>
          <section className="bg-white p-4 rounded-lg">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <h3 className="text-lg font-roboto  font-bold mb-2 text-slate-800">
                {t("meeting:summary.title")}
              </h3>
              {!isLoading ? (
                <Button
                  fullWidth={false}
                  isLoading={isLoading}
                  onClick={generateAgain}
                >
                  {t("meeting:summary.generateAgain")}
                </Button>
              ) : null}
            </div>

            <p className="text-sm font-roboto  text-slate-600">
              {summary?.summary}
            </p>

            <ul className="list-disc pl-6 mt-3 text-sm font-roboto ">
              {summary?.key_points?.map((point) => (
                <li className="text-slate-600" key={point}>
                  {point}
                </li>
              )) || []}
            </ul>
            {isLoading && MeetingSummariesSkeleton}
          </section>

          <section className="p-4 rounded-lg">
            <h3 className="text-lg font-roboto  font-bold mb-2 text-slate-800">
              {t("meeting:summary.decisions")}
            </h3>

            <ul className="text-sm font-roboto  flex flex-col">
              {decisions?.map((decision) => (
                <li
                  className="px-3 py-2 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                  key={decision.description}
                >
                  <span className="text-slate-600">{decision.description}</span>
                  <span className="text-xs font-roboto  text-slate-500">
                    {t("meeting:summary.decidedBy", {
                      name: decision.decided_by || t("common:unknown"),
                    })}
                  </span>
                </li>
              ))}
            </ul>
            {isLoading && MeetingSummariesSkeleton}
          </section>

          <section className="p-4 rounded-lg">
            <h3 className="text-lg font-roboto  font-bold mb-2 text-slate-800">
              {t("meeting:summary.actions")}
            </h3>

            <ul className="text-sm font-roboto  flex flex-col">
              {actions?.map((action, i) => (
                <li
                  className="text-slate-700 px-3 py-2 rounded-md flex flex-col gap-1"
                  key={i}
                >
                  <span>{action.description}</span>
                  <div className="text-xs font-roboto  text-slate-400 flex flex-col sm:flex-row sm:justify-between gap-2">
                    <span>
                      {t("meeting:summary.owner", {
                        owner: action.owner || t("common:unknown"),
                      })}
                    </span>
                    <span>
                      {t("meeting:summary.deadline", {
                        deadline: action.deadline || t("common:none"),
                      })}
                    </span>
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
