import { baseApi, store } from "@intelli-meeting/store";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  timeAgo: string;
}

export const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], unknown>({
      query: ({ limit = 5 }) => ({
        url: `/notification?limit=${limit}`,
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        await cacheDataLoaded;

        const userId = store.getState().auth.user?.id;
        const ws = new WebSocket(
          `${process.env.NEXT_PUBLIC_WS_URL}/notification/${userId}`,
        );

        ws.onmessage = (event) => {
          const newNotification: Notification = JSON.parse(event.data);
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
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
