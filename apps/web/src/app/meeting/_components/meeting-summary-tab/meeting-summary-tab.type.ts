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

export interface MeetingSummaryTabProps {
  meetingId?: string;
}
