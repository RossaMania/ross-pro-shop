import { createSlice } from "@reduxjs/toolkit";

//Initial state of the cart. If there is a cart (with items) in local storage, use that. If not, use an empty array.
const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {cartItems: []};

//Helper function to add decimals to the pricing.
const addDecimals = (num) => {
  return (Math.round(num * 100) /100).toFixed(2);
}

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

    //Calculate items price
    //Take the state, and add that itemsPrice value. Use the reduce method to add all the prices of all the items in the cart together.
    //Reduce method takes a function with the accumulator and the item itself as arguments.
    //We start the accumulator at 0, and then add on the price of the item multiplied by the quantity of the item.
    state.itemsPrice = addDecimals(state.cartItems.reduce((accumulator, item) => accumulator + item.price * item.qty, 0));

    //Calculate shipping price
    //Calculate tax price
    //Calculate total price
  }
},
});

export default cartSlice.reducer;