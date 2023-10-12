import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems: []};

const cartSlice = createSlice({
name: "cart",
initialState,
reducers: {
  addToCart: (state, action) => {
    const item = action.payload;
    const existItem = state.cartItems.find((currentItem) => currentItem._id === item._id);

    if (existItem) {
state.cartItems = state.cartItems.map((cartItem) => cartItem._id === existItem._id ? item : cartItem)
    } else {
      state.cartItems = [...state.cartItems, item]
    }

  }
},
});

export default cartSlice.reducer;