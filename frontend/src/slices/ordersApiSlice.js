import { apiSlice } from "./apiSlice.js";
import { ORDERS_URL } from "../constants.js";

export const ordersApiSlice = apiSlice.injectEndpoints({
  //Define the available endpoints for the orders API.
  //The endpoints are functions that return an object with a query property.
  //The query property is a function that returns an object with the URL, method, and body of the request.
  //The body of the request is the order data.
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET", //The method is GET because we are getting the order details. The method is GET by default.
      }),
      keepUnusedDataFor: 5, //This will prevent the order details from being cached.
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery } = ordersApiSlice;
