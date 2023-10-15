import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Generate a token
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  //Set JSON Web Token as a HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
}

export default generateToken;