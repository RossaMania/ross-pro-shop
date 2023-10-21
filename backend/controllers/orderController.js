import asyncHandler from "../middleware/asyncHandler.js";

import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  res.send("Add order items!");
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
  res.send("Get my orders!");
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