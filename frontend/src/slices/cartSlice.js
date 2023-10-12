import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

//Initial state of the cart. If there is a cart (with items) in local storage, use that. If not, use an empty array.
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };



const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (currentItem) => currentItem._id === item._id
      );

      //Check if item is already in cart
      //If it is, replace it with the new item
      if (existItem) {
        state.cartItems = state.cartItems.map((cartItem) =>
          cartItem._id === existItem._id ? item : cartItem
        );
      } else {
        //If it isn't, add it to the cart
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);

    },
  },
});


export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
