/* eslint-disable max-lines-per-function */
import { Button, EmptyState } from "@intelli-meeting/shared-ui";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiCopy } from "react-icons/fi";

import { useMeetingChat } from "../../_hooks";

interface MeetingChatTabProps {
  meetingId: string;
  isActive?: boolean;
}

const STATUS_MESSAGE_MAP: Record<string, string> = {
  no_meeting_info: "meeting:chat.noMeetingInfo",
  processing_error: "meeting:chat.processingError",
};

export const MeetingChatTab = ({
  meetingId,
  isActive,
}: MeetingChatTabProps) => {
  const { t } = useTranslation();
  const {
    messages,
    isProcessing,
    isHistoryLoading,
    permissionError,
    connectionError,
    inputValue,
    isConnected,
    setInputValue,
    sendMessage,
  } = useMeetingChat(meetingId);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, scrollToBottom]);

  useEffect(() => {
    if (isActive) scrollToBottom();
  }, [isActive, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const isSendDisabled = useMemo(
    () =>
      isProcessing ||
      !inputValue.trim() ||
      permissionError ||
      !isConnected ||
      Boolean(connectionError),
    [connectionError, inputValue, isConnected, isProcessing, permissionError],
  );

  const renderMessage = (content: string, code?: string | null) => {
    const translationKey = code ? STATUS_MESSAGE_MAP[code] : undefined;
    if (translationKey) return t(translationKey);
    return content;
  };

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  if (permissionError) {
    return (
      <EmptyState
        className="bg-white rounded-lg"
        description={t("meeting:chat.permissionError")}
        title={t("meeting:chat.title")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-[60vh] max-h-[75vh]">
      <div
        className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3"
        ref={messagesRef}
      >
        {connectionError ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-700 p-3 text-sm">
            {t("meeting:chat.connectionError")}
          </div>
        ) : null}

        {isHistoryLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                className="h-5 bg-slate-200 animate-pulse rounded-md w-2/3"
                key={item}
              />
            ))}
          </div>
        ) : null}

        {!isHistoryLoading && messages.length === 0 ? (
          <EmptyState
            className="bg-slate-50 rounded-lg"
            description={t("meeting:chat.empty")}
            title={t("meeting:chat.title")}
          />
        ) : null}

        {messages.map((message) => {
          const content = renderMessage(message.content, message.message_code);
          const isAssistant = message.role !== "user";
          return (
            <div
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              key={`${message.id}-${message.created_at}`}
            >
              <div className="flex items-start gap-2 max-w-[95%] sm:max-w-[80%]">
                <div
                  className={`w-full px-4 py-3 rounded-2xl text-sm font-roboto ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="whitespace-pre-wrap break-words">
                      {content}
                    </span>
                    {isAssistant ? (
                      <button
                        aria-label={t("meeting:chat.copy")}
                        className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] font-roboto text-slate-600 hover:bg-white shrink-0"
                        onClick={() => handleCopy(message.content, message.id)}
                        type="button"
                      >
                        <FiCopy />
                        {copiedId === message.id
                          ? t("meeting:chat.copied")
                          : t("meeting:chat.copy")}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            {t("meeting:chat.loading")}
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-slate-50 rounded-lg p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              aria-label={t("meeting:chat.placeholder")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-roboto  text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isProcessing || permissionError}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("meeting:chat.placeholder")}
              value={inputValue}
            />
          </div>
          <div className="sm:w-36">
            <Button
              disabled={isSendDisabled}
              fullWidth
              isLoading={isProcessing}
              onClick={sendMessage}
            >
              {t("meeting:chat.send")}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {connectionError
            ? t("meeting:chat.connectionError")
            : isProcessing
              ? t("meeting:chat.disabledHint")
              : t("meeting:chat.helper")}
        </div>
      </div>
    </div>
  );
};
