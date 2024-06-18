const express = require("express");
const routes = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  logginstatus,
  updateUser,
  changepassword,
  forgotpassword,
} = require("../controller/user_controller");
const protect = require("../middleware/AuthMiddleware");

routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.get("/logout", logoutUser);
routes.get("/getUser", protect, getUser);
routes.get("/loggedin", logginstatus);
routes.patch("/updateuser", protect, updateUser);
routes.patch("/changepassword", protect, changepassword);
routes.post("/forgotpassword",forgotpassword );

// this are my exports...
module.exports = routes;
