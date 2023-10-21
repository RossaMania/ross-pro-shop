import express from "express";

const router = express.Router();

import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// "/" === /api/orders
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders); //Either a regular user creates order or an Admin user gets all the orders.
router.route("/mine").get(protect, getMyOrders); //A regular user gets their own orders.
router.route("/:id").get(protect, admin, getOrderById); //An Admin user gets order by ID.
router.route("/:id/pay").put(protect, updateOrderToPaid); //A regular user updates order to paid.
router.route("/:id/delivery").put(protect, admin, updateOrderToDelivered); //An Admin user updates order to delivered status.

export default router;
