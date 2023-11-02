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



app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }));

const __dirname = path.resolve(); // Set __dirname to the current directory name.

// We want the server to load the production server or the build server when in production.
// A test to see if we're in production. If we're in production, then we want to set a static folder.
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")))

  // any route that is not api routes will be redirected to index.html
  app.get("*", (req, res) =>
  // load the index.html file that's in the frontend/build folder which we just made static.
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  //If we're not in production, then run the following code to set up our API routes on the dev server.
  //Routes
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Make the uploads folder static so that we can access the images inside it.
// Pass in uploads to app.use, make it static with express.static, then pass in location of that folder, /uploads, with path.join.
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
