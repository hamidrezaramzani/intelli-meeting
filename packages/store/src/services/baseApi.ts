import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { createApi } from "@reduxjs/toolkit/query/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios";

import type { RootState } from "../store";

import { logout } from "../slices";

export interface BaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: any;
  responseType?: AxiosRequestConfig["responseType"];
}

export interface BaseQueryError {
  status: number;
  data?: any;
}

const axiosBaseQuery =
  (): BaseQueryFn<BaseQueryArgs, unknown, BaseQueryError> =>
  async (
    { url, method = "GET", data, responseType = "json" },
    { getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState;
      const accessToken = state.auth?.token || localStorage.getItem("token");

      const client = axios.create();

      client.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
          if (error.response?.status === 401) {
            dispatch(logout());
          }
        },
      );

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const response = await client({
        url: `${baseUrl}${url}`,
        method,
        data,
        responseType,
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });

      return { data: response.data };
    } catch (err: any) {
      const axiosError = err as AxiosError;
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});
