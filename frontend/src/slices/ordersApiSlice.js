import { apiSlice } from "./apiSlice.js";
import { ORDERS_URL, PAYPAL_URL } from "../constants.js";

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
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT", //The method is PUT because we are updating the order to paid.
        body: { ...details },
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
        method: "GET", //The method is GET because we are getting the info from PayPal. The method is GET by default.
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
        method: "GET", //The method is GET because we are getting the orders. The method is GET by default.
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        method: "GET", //The method is GET because we are getting the orders. The method is GET by default.
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/delivery`,
        method: "PUT", //The method is PUT because we are updating the order (data) to delivered.
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
