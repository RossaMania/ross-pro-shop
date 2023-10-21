import asyncHandler from "../middleware/asyncHandler.js";

import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, } = req.body; //Destructure req.body from the HTTP request.

//Check for an order items array. If there is an order items array, we want to see if it's empty or not.
if (orderItems && orderItems.length) {
  res.status(400); //Bad request
  throw new Error("Oops! No items in this order!"); //Throw an error if there are no order items.
} else {
  //If there are order items, create a new order.
  //This just creates an order and puts it in the order const. Nothing is saved in the database.
  const order = new Order({
    orderItems: orderItems.map((item) => ({
      //Map through the order items array and return a new array of order items.
      //This is because we want to add the product ID to the order items array.
      ...item,
      product: item._id,
      //Remove the _id field from the order items array.
      //This is because there's no _id field in the orderModel.js orderItems array.
      _id: undefined,
    })),
    user: req.user._id, //Get the user ID from the token.
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createOrder = await order.save(); //Save the order to the database.

  res.status(201).json(createOrder); //Send a 201 status code (something was created) and send the order data in JSON format.
}

});

// @desc    Get logged in user's orders.
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  res.send("Get order by ID!");
});

// @desc    Get order by ID.
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }); //Get all orders from the database where the user ID matches the user ID in the token.
  res.json(orders); //Send the orders in JSON format.
});

// @desc    Update order to paid. This is an admin user route.
// @route   GET /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("Update order to paid!");
});

// @desc    Update order to delivered. This is an admin user route.
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("Update order to delivered!");
});

// @desc    Update order to delivered. This is an admin user route.
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  res.send("Get all orders!");
});

export { addOrderItems, getOrderById, getMyOrders, updateOrderToPaid, updateOrderToDelivered, getOrders };