import asyncHandler from "../middleware/asyncHandler.js";

import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  // If no order items, throw an error.
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database.
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    //Create order and save it to the database.
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID.
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  //Get the order by ID from the database. The id comes from the URL, so we use params.id.
  //This brings up everything about the order from the Orders collection.
  //Populate the user field with the user's name and email from the users collection.
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    //If the order exists, send the order data in JSON format.
    res.status(200).json(order);
  } else {
    //If the order doesn't exist, throw an error.
    res.status(404); //Not found
    throw new Error("Oops! Order not found!");
  }
});

// @desc    Get logged in user's orders.
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }); //Get all orders from the database where the user ID matches the user ID in the token.
  res.json(orders); //Send the orders in JSON format.
});

// @desc    Update order to paid. This is an admin user route.
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error("Payment not verified");

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error("Transaction has been used before");

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    //Save the updated order to the database.
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered. This is an admin user route.
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id); //Get the order by ID from the database.
  if (order) {
    order.isDelivered = true; //Set isDelivered to true.
    order.deliveredAt = Date.now(); //Set the deliveredAt date to now.

    const updatedOrder = await order.save(); //Save the result, the updated order, to the database.

    res.status(200).json(updatedOrder); //Send the updated order in JSON format.

  } else {
    res.status(404); //Not found
    throw new Error("Oops! Order not found!");
  }
});

// @desc    Get all orders.
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  //Get all orders from the database and populate the user field with the user's ID and name from the User collection.
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders); //Send the orders in JSON format with a 200 status code (OK).
});

export { addOrderItems, getOrderById, getMyOrders, updateOrderToPaid, updateOrderToDelivered, getOrders };