import { apiSlice } from "./apiSlice.js";
import { ORDERS_URL } from "../constants.js";

export const ordersApiSlice = apiSlice.injectEndpoints({
  //Define the available endpoints for the orders API.
  //The endpoints are functions that return an object with a query property.
  //The query property is a function that returns an object with the URL, method, and body of the request.
  //The body of the request is the order data.
  //The order data is passed in as an argument to the query function.
  //The query function is passed in as an argument to the endpoint function.
  //The endpoints function is passed in as an argument to the injectEndpoints function.
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: {...order}
      })
    })
  })
});

export const { useCreateOrderMutation } = ordersApiSlice;