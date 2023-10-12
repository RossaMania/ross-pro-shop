//Helper function to add decimals to the pricing.
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {

        //Calculate items price
      //Take the state, and add that itemsPrice value. Use the reduce method to add all the prices of all the items in the cart together.
      //Reduce method takes a function with the accumulator and the item itself as arguments.
      //We start the accumulator at 0, and then add on the price of the item multiplied by the quantity of the item.
      state.itemsPrice = addDecimals(
        state.cartItems.reduce(
          (accumulator, item) => accumulator + item.price * item.qty,
          0
        )
      );

      //Calculate shipping price (If order is over $100, shipping is free. Else, shipping is $10).
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

      //Calculate tax price (15% tax).
      state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

      //Calculate total price.
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      //Save everything to local storage as "cart".
      localStorage.setItem("cart", JSON.stringify(state));

      return state;

}