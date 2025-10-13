import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import {
  formatErrorMessage,
  showErrorToast,
  showSuccessToast,
} from "../Lib/ApiUtil";
import type { RootState } from "./StoreConfig";
import {
  addTokensAndUser,
  removeTokensAndUser,
  setSessionExpired,
} from "./slice/Account";

const mutex = new Mutex();

const baseUrl = import.meta.env.VITE_BASE_URL + "/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth?.accessToken;
    // if (accessToken) {
    // headers.set("authorization", `Bearer ${accessToken}`);
    headers.set(
      "authorization",
      `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsIjoic2hlaWttbzI0MjV2QGdtYWlsLmNvbSIsInVpZCI6ImQ5ZDM5YTE2LTE5YzUtNGIyMC05ZjM1LTVjYTgwYTA0ZmEwNyIsImlwIjoiMTA2LjIwNS4xMjIuMTE5Iiwicm9sZXMiOiJBZG1pbiIsInJvbGVJZHMiOiI2YTQ4MWQ2Zi0zYzFiLTRkNGUtYTcyMC0wYzgyNmNmMmViNmQiLCJuYmYiOjE3NjAzMzg0NDcsImV4cCI6MTc2MDQyNDg0NywiaXNzIjoiQ29tbWlzc2lvbi5Bc3Npc3QzNjAuQXBpIiwiYXVkIjoiQ29tbWlzc2lvbi5Bc3Npc3QzNjAuQXBpLlVzZXIifQ.5VtNqChMiEldSj450xFtDgPKdQv-4MmKZMea0KbEC6PFZSIxJvPbTk19f520uta-rqGXkqu0VxtDn2suSC7r4w`
    );
    // }
    return headers;
  },
});

const APIFetchBase: BaseQueryFn<FetchArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();
  let result: any = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth?.refreshToken;

        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: "/Account/refresh",
              method: "POST",
              body: {
                refreshToken,
                token: state.auth?.accessToken,
              },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            api.dispatch(
              addTokensAndUser(
                refreshResult.data as {
                  accessToken: string;
                  refreshToken: string;
                }
              )
            );
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(setSessionExpired(true));
            api.dispatch(removeTokensAndUser());
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  if (result?.error) {
    const message = formatErrorMessage(result.error);
    showErrorToast(message);
  } else {
    const method = result?.meta?.request?.method?.toUpperCase();
    const requestUrl = result?.meta?.request?.url ?? "";

    const excludedUrls = ["/account/login", "/Account/refresh"];
    const isExcluded = excludedUrls.some((url) => requestUrl.includes(url));

    if (!isExcluded) {
      const responseData: any = result.data;
      const customMessage =
        responseData?.message || responseData?.data?.message;

      if (customMessage) {
        showSuccessToast(customMessage);
      } else if (method === "POST") {
        showSuccessToast("Created successfully");
      } else if (method === "PUT") {
        showSuccessToast("Updated successfully");
      } else if (method === "DELETE") {
        showSuccessToast("Deleted successfully");
      }
    }
  }

  return result;
};

export default APIFetchBase;
