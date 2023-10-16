import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./slices/apiSlice";

import cartSliceReducer from "./slices/cartSlice";

import authSliceReducer from "./slices/authSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer, // Add the cart slice reducer function to the store.
        auth: authSliceReducer, // Add the auth slice reducer function to the store.
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), // Add the apiSlice middleware to the store
    devTools: true,
});

export default store;