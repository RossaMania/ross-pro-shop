import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config(); // Use environmental variables in .env.

connectDB(); // Connect to MongoDB

const importData = async () => {
  try {
    await Order.deleteMany(); // delete all orders
    await Product.deleteMany(); // delete all products
    await User.deleteMany(); // delete all users

    const createdUsers = await User.insertMany(users); // returns an array of users

    const adminUser = createdUsers[0]._id; // the first user is the admin

    const sampleProducts = products.map(product => {
      return {...product, user: adminUser};
    }); // returns an array of products

    await Product.insertMany(sampleProducts); // insert all products and admin user into the database

    console.log("Data imported!".green.inverse);

    process.exit(); // exit the process

  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1); // exit with failure
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany(); // delete all orders
    await Product.deleteMany(); // delete all products
    await User.deleteMany(); // delete all users

    console.log("Data destroyed!".red.inverse);

    process.exit(); // exit the process
  } catch (error) {
    console.log(`${error}`.red.inverse);
  }
}

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}