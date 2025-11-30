"use client";
import { Chip, Tabs } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { TiPinOutline } from "react-icons/ti";

import { getBounceEffect } from "@/lib/helpers";
import { useReadOneMeetingQuery } from "@/services";
import { Dashboard } from "@/ui";

import { MeetingManagementTab } from "../_components";

const Meeting = () => {
  const router = useRouter();

  const { id } = useParams();

  const { data: meetingData } = useReadOneMeetingQuery(
    id ? { meetingId: id as string } : skipToken
  );

  const meeting = meetingData?.meeting;
  useAuthRedirect({
    type: "unlogged",
    onRedirect: () => router.push("/sign-in"),
  });

  return (
    <Dashboard backUrl="/meetings" title="Meeting">
      {meeting ? (
        <>
          <motion.div
            className="px-3 flex flex-col gap-12 mt-8"
            {...getBounceEffect(1)}
          >
            <div className="flex flex-col gap-3 justify-center">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-slate-800 text-4xl font-bold flex items-center gap-4">
                    {meeting.title}
                    <a
                      className="text-md"
                      href={meeting.meeting_link}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <TiPinOutline className="text-md" />
                    </a>
                  </h1>
                </div>
              </div>
              <div>
                <h4 className="text-md text-slate-500">
                  {meeting.date} - {meeting.start_time} - {meeting.end_time}
                </h4>
              </div>
              <p className="text-slate-600 font-body">{meeting.description}</p>
            </div>

            <div className="flex gap-4 my-2">
              {meeting?.employees?.map((employee: any) => (
                <Chip key={employee.id}>{employee.fullName}</Chip>
              ))}
            </div>
          </motion.div>

          <motion.div {...getBounceEffect(2)} className="mt-5">
            <Tabs
              tabs={[
                {
                  label: "Management",
                  content: <MeetingManagementTab audios={meeting?.audios} />,
                },
                { label: "Summary", content: <div>Summary</div> },
              ]}
            />
          </motion.div>
        </>
      ) : null}
    </Dashboard>
  );
};

export default Meeting;
