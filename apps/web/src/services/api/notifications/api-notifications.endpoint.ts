import { baseApi, store } from "@intelli-meeting/store";

import { normalizeWebsocketResponse } from "@/lib/helpers/normalize-websocket-response";

import type {
  Notification,
  ReadDashboardNotificationsResponse,
  ReadManyNotificationsRequest,
  ReadManyNotificationsResponse,
} from "./api-notifications.type";

export const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    readDashboardNotifications: builder.query<
      ReadDashboardNotificationsResponse,
      unknown
    >({
      query: ({ limit = 5 }) => ({
        url: `/notification/dashboard/?limit=${limit}`,
      }),
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        await cacheDataLoaded;

        const userId = store.getState().auth.user?.id;
        const ws = new WebSocket(
          `${process.env.NEXT_PUBLIC_WS_URL}/notification/${userId}`,
        );

        ws.onmessage = (event) => {
          const newNotification =
            normalizeWebsocketResponse<Notification>(event);
          const audio = new Audio("/notif.mp3");
          audio
            .play()
            .catch((err) =>
              console.error("Failed to play notification sound", err),
            );

          updateCachedData((draft) => {
            draft.unshift(newNotification);
            if (draft.length > 5) draft.shift();
          });
        };

        await cacheEntryRemoved;
        ws.close();
      },
      transformResponse: (data: any) => data.notifications,
      providesTags: ["Notifications"],
    }),
    readManyNotifications: builder.query<
      ReadManyNotificationsResponse,
      ReadManyNotificationsRequest
    >({
      query: ({ query }) => ({
        url: `/notification?limit=${query.limit}&page=${query.page}`,
      }),
      providesTags: ["Notifications"],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `/notification/marks-all-as-read`,
        method: "PATCH",
        data: {},
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useReadDashboardNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useReadManyNotificationsQuery,
} = notificationApi;
