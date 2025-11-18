import { Button, Modal } from "@intelli-meeting/shared-ui";
import { MdPlayArrow } from "react-icons/md";

import { useReadAudioSpeakersQuery } from "@/services";

import type { SpeakersModalProps } from "./speakers-modal.type";

import { Table } from "../table";
import { SPEAKERS_COLUMNS } from "./speakers-modal.constant";

export const SpeakersModal = ({ onClose, audio }: SpeakersModalProps) => {
  const {
    data: speakers = [],
    error,
    refetch,
  } = useReadAudioSpeakersQuery({ audioId: audio?.id });

  const handlePlayClick = (row: any) => {
    console.log("Play speaker audio:", row.speaker);
  };

  return (
    <Modal title="Speakers" onClose={onClose} open={!!audio?.id}>
      <div className="space-y-4">
        <Table
          data={speakers}
          refetch={refetch}
          title="List of Speakers"
          actions={[
            {
              children: <MdPlayArrow />,
              onActionClick: handlePlayClick,
              title: "Play audio",
            },
          ]}
          columns={SPEAKERS_COLUMNS}
          description="This table shows all speakers of the audio. You can assign them to employees."
          error={!!error}
        />

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
