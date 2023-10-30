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
      providesTags: ["User"], //This is the tag for the data that we are fetching from the backend API endpoint at USERS_URL.
      keepUnusedDataFor: 5, //This is the number of seconds to keep the data in the cache. If the data is not used within this time, then it will be removed from the cache.
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, //The url is the USERS_URL + the userId that we pass in as an argument to the query function.
        method: "DELETE", //The method is DELETE because we are deleting the user by id.
      }),
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, //The url is the USERS_URL + the userId that we pass in as an argument to the query function.
        method: "GET", //The method is GET because we are getting the user details.
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: ({ data }) => ({
        url: `${USERS_URL}/${data.userId}`, //The url is the USERS_URL + the userId that we pass in as an argument to the query function.
        method: "PUT", //The method is PUT because we are updating the user details.
        body: data, //Send the data in the body.
      }),
      invalidatesTags: ["User"], //This is the tag for the data that we are fetching from the backend API endpoint at USERS_URL.
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = usersApiSlice;
