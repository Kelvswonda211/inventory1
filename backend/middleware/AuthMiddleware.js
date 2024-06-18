const asyncHandler = require("express-async-handler");
const user = require("../model/usermodel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("not authorized , please login!");
    }

    // if token is available then verify token before granting access
    const verified = jwt.verify(token, process.env.Jw_secret);

    // after verifying , get id from token
   const user = await user.findbyId(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("user not found!");
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401);
      throw new Error("could not login, please review your credentials!")
  }
});

module.exports = protect;
