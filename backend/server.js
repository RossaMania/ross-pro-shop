import path from "path"; // This is a built-in Node.js module that allows us to work with file paths.

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const port = process.env.PORT;

connectDB(); // Connect to MongoDB

const app = express();

//Body parser middleware
app.use(express.json()) //Allows us to accept JSON data in the body (req.body) of a request. Without this, req.body will be undefined.
app.use(express.urlencoded({ extended: true })) //Allows us to accept form data in the body (extended: true allows us to accept nested objects).


//Cookie parser middleware
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));

const __dirname = path.resolve(); // Set __dirname to the current directory name.

// Make the uploads folder static so that we can access the images inside it.
// Pass in uploads to app.use, make it static with express.static, then pass in location of that folder, /uploads, with path.join.
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
