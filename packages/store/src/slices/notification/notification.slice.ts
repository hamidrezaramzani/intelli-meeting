import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

import type { Notification, NotificationState } from "./notification.type";

const initialState: NotificationState = {
  list: [],
  newNotification: undefined,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.unshift(action.payload);
      state.newNotification = action.payload;
    },
    clearNewNotification: (state) => {
      state.newNotification = undefined;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.list = action.payload;
    },
  },
});

export const { addNotification, clearNewNotification, setNotifications } =
  notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
