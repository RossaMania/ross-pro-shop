import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true, // only admins can create new products
    default: false,
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;