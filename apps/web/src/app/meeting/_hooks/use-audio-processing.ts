import { useAppDispatch } from "@intelli-meeting/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useRef } from "react";

import { useWebSocket } from "@/lib";
import { meetingsApi, useReadOneMeetingQuery } from "@/services";

export const useAudioProcessing = (meetingId?: string) => {
  const dispatch = useAppDispatch();
  const { connect, isConnected } = useWebSocket();
  const hasConnectedRef = useRef(false);
  const { data } = useReadOneMeetingQuery(
    meetingId ? { meetingId } : skipToken,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openedProcessingAudios =
    data?.meeting?.audios?.filter((a) => a.is_processing === true) || [];

  const connectSocket = useCallback(
    (reconnect: boolean, audioId?: number) => {
      if (hasConnectedRef.current) return;

      const wsPath = `/audio/process-audio?meeting_id=${meetingId}&reconnect=${reconnect}${audioId ? `&audio_id=${audioId}` : "&audio_id=0"}`;
      hasConnectedRef.current = true;

      connect(wsPath, (event) => {
        const payload = JSON.parse(event.data);

        if (!meetingId) return;
        dispatch(
          meetingsApi.util.updateQueryData(
            "readOneMeeting",
            { meetingId },
            (draft) => {
              const audio = draft.meeting.audios.find(
                (a) => String(a.id) === payload.audioId,
              );

              if (!audio) return;

              switch (payload.type) {
                case "audio_progress":
                  audio.status = "processing";
                  audio.is_processing = true;
                  break;

                case "audio_done":
                  audio.status = "success";
                  audio.is_processing = false;
                  audio.transcript = payload.transcript;
                  audio.speaker_profiles = payload.speakerProfiles;
                  break;

                case "audio_failed":
                  audio.status = "failed";
                  audio.is_processing = false;
                  break;

                default:
                  break;
              }
            },
          ),
        );
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meetingId],
  );

  useEffect(() => {
    if (openedProcessingAudios && openedProcessingAudios.length > 0) {
      openedProcessingAudios.forEach((audio) => {
        connectSocket(true, audio.id);
      });
      connectSocket(true);
    }
  }, [openedProcessingAudios, connectSocket]);

  const startAudioProcessing = useCallback(
    (audioId: number) => {
      connectSocket(false, audioId);
    },
    [connectSocket],
  );

  return {
    isConnected,
    startAudioProcessing,
    hasProcessingAudio: openedProcessingAudios.length > 0,
  };
};
