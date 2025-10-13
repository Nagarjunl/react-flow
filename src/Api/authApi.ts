import { createApi } from "@reduxjs/toolkit/query/react";
import APIFetchBase from "../Store/ApiConfig";
import type { loginType, UserLoginType } from "../Dto/authDto";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: APIFetchBase,
  endpoints: (builder) => ({
    login: builder.mutation<UserLoginType, loginType>({
      query: (payload: loginType) => {
        return {
          method: "POST",
          url: "/account/login",
          body: payload,
        };
      },
    }),
    passwordRequest: builder.mutation<string, string>({
      query: (payload: string) => {
        return {
          method: "POST",
          url: "/Account/reset-password-request",
          body: `"${payload}"`,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    resetPassword: builder.mutation<any, any>({
      query: (payload: any) => {
        return {
          method: "POST",
          url: "/Account/reset-password",
          body: payload,
        };
      },
    }),

    logout: builder.mutation<
      { status: number; message: string },
      number | undefined
    >({
      query: (userId: number) => {
        return {
          method: "POST",
          url: `/account/logout/${userId}`,
        };
      },
    }),


  }),
});

export const { useLoginMutation, useLogoutMutation, usePasswordRequestMutation, useResetPasswordMutation } = authApi;
