import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import User from "../models/userModel";

// Protect routes function
const protect = asyncHandler(async (req, res, next) => {

  let token;

  // Read the JWT from the cookie

  token = req.cookies.jwt; //name of the token variable in the res.cookie that was set in userController.js.

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //decoded const is the payload of the JWT. It becomes the req.user object.
      req.user = await User.findById(decoded.userId).select("-password"); //We can then use the User model to find the user by ID from the const decoded payload.
      next(); //We can then use the req.user object in any protected routes. We call the next() function to move on to the next middleware function.
    } catch (error) {
      console.log(error);
       res.status(401); //If there's an error, that means the token is there, but it's not the correct token.
       throw new Error("Oops! Not authorized, token failed!");
    }

  } else {
    res.status(401);
    throw new Error("Oops! Not authorized, no token!");
  }

})


// Admin middleware function
// This function will be used in the userRoutes.js file to protect routes that only admins can access.
// We will check the user's isAdmin property to see if that is true. If isAdmin is true, the user is an admin.

const admin = (req, res, next) => {
if (req.user && req.user.isAdmin) {
  next();
} else {
  res.status(401);
  throw new Error("Oops! Not authorized as an admin!");
}
};

export { protect, admin };

