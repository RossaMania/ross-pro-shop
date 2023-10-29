import { USERS_URL } from "../constants";

import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      //This query takes IN data, so we can update the user profile.
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT", //The method is PUT because we are updating the user profile.
        body: data, //Send the data in the body.
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ["Users"], //This is the tag for the data that we are fetching from the backend API endpoint at USERS_URL.
      keepUnusedDataFor: 5, //This is the number of seconds to keep the data in the cache. If the data is not used within this time, then it will be removed from the cache.
      })
    })
  });

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation, useGetUsersQuery } = usersApiSlice;
