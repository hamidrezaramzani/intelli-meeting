import { AudioPlayer, EmptyState } from "@intelli-meeting/shared-ui";
import { useState } from "react";

import {
  usePlayAudioMutation,
  useReadManyEmployeeCandidatesQuery,
} from "@/services";

import type { MeetingManagementTabProps } from "./meeting-management-tab.props";

import { MeetingTranscribeSentence } from "../meeting-transcribe-sentence";

export const MeetingManagementTab = ({ audios }: MeetingManagementTabProps) => {
  const [playAudio] = usePlayAudioMutation();
  const { data: employees } = useReadManyEmployeeCandidatesQuery({});

  const [showTextPopover, setShowTextPopover] = useState<number | null>();

  const handleMeetingSummarySelect = (selectedId: number | null) => {
    setShowTextPopover(
      showTextPopover === Number(selectedId)
        ? null
        : selectedId
          ? Number(selectedId)
          : null
    );
  };

  const getAudioBlob = async (audioId: number) => {
    const blob = await playAudio({ audioId }).unwrap();
    const blobWithMime = new Blob([blob], { type: "audio/wav" });
    return blobWithMime;
  };

  return (
    <div className="text-gray-800 transition-all cursor-pointer leading-9">
      {audios.length ? (
        audios.map((audio) => (
          <div className="flex flex-col gap-4" key={audio.id}>
            <AudioPlayer
              title={audio.name}
              onPlay={() => getAudioBlob(audio.id)}
            />
            <div className="mb-4">
              {audio.speaker_profiles.map((text) => (
                <MeetingTranscribeSentence
                  key={text.id}
                  text={text}
                  employees={employees}
                  onTranscribeSelect={handleMeetingSummarySelect}
                  openedTextPopoverId={showTextPopover}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          title="No audio available"
          description="There are no audios recorded for this meeting yet"
        />
      )}
    </div>
  );
};
