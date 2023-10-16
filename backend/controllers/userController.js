import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Authorize user and get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email});

  if (user && (await user.matchPassword(password))) {

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(401);
    throw new Error("Oops! Invalid email or password!");
  }

});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // destructure req.body into name, email, password variables.

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("Oops! User already exists!");
  }

  // create a new user with name, email, password variables from the form the user filled out.
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Oops! Invalid user data!");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({message: "Logged out successfully!" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id) // req.user._id is the user ID from the token

  // if user exists, send back user data in JSON format with 200 status code.
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
    } else {
      res.status(404);
      throw new Error("Oops! User not found!");
    };
    // if user doesn't exist, throw error and send back 404 status code and error message.
  });

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("Update user profile!");
});

// @desc    Admin can get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("Get users!");
});

// @desc    Admin can get any user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
  res.send("Get user by ID!");
});

// @desc    Admin deletes user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete user!");
});

// @desc    Admin updates any user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update user!");
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, getUserByID, deleteUser, updateUser };