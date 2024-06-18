const mongoose = require("mongoose");
var user = require("../model/usermodel");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const token = require("../model/tokenModel");
const crypto = require("crypto");


const generateToken = (_id) => {
  return jwt.sign({ id }, process.env.JW_secret, { expiresIn: "1d" });
};

// this controller is for register user

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // validation for the above
  if (!name || !email || !phone || !password) {
    req.status(400);
    throw new Error("dear user, please fill all fields!");
  }

  if (password.lenght < 6) {
    req.status(400);
    throw new Error("password must be up to 6 characters!");
  }

  // to check ifan email already exists
  const user_email_exist = await user.findOne({ email });

  if (user_email_exist) {
    req.status(400);
    throw new Error("This email has already been used!");

    // to create new user
    const registeruser = await user.create({
      name,
      email,
      phone,
      password,
    });

    Token = generateToken(user._id);

    // to send HTTP-only Token
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: newDate(Date.now() + 1000 * 86400),
      //  this is approximate to one day oh
      sameSite: "none",
      secure: true,
    });

    if (user) {
      const { _id, name, email, phone, bio } = user;

      res.status(201).json({
        _id,
        name,
        email,
        phone,
        bio,
        token,
      });
    } else {
      throw new Error("invalid user data");
    }
  }

  // if (!req.body.email) {
  //   req.status(400)
  //   throw new error ("please enter an email");
  // // }
  // res.send("register user");
});

// this controller is for login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("please add email and password");
  }

  // check if user exist in database
  const user = await user.findOne({ email });
  if (!email) {
    res.status(400);
    throw new Error(" user does not exist, please sign up!");
  }

  // if user exists, now check for password accuracy
  const passwordIsIcorrect = await bcrypt.compare(password, user.password);

  Token = generateToken(user._id);

  // to send HTTP-only Token
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: newDate(Date.now() + 1000 * 86400),
    //  this is approximate to one day oh
    sameSite: "none",
    secure: true,
  });

  // if accurate then login

  if (user && passwordIsIcorrect) {
    const { _id, name, email, phone, bio } = user;

    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("invalid email or password");
  }
});

// this controller is for logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: newDate(0),
    //  this is approximate to one day oh
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "logged out succesfully" });
});

// this controller is for getuser
const getUser = asyncHandler(async (req, res) => {
  const user = await user.findbyId(req.user._id);
  if (user) {
    const { _id, name, email, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

// this is for getting login status
const logginstatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  // if token is available then verify token before granting access
  const verified = jwt.verify(token, process.env.JW_secret);

  if (verified) {
    return res.json(true);
  }
  return res.json(falsefalse);
});

// this controller is for update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await user.findbyId(req.user._id);

  if (user) {
    const { _id, name, email, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.email,
      email: updateUser.email,
      phone: updateUser.phone,
      bio: updateUser.bio,
    });
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

// this controller is for chnage password
const changepassword = asyncHandler(async (req, res) => {
  const user = await user.findbyId(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("user not found,please sign up!");
  }

  const { oldpassword, newpassword } = req.body;
  // validate

  if (!oldpassword || !newpassword) {
    res.status(400);
    throw new Error("old password or new password wrong!`");
  }

  // to check if old password matches the db
  const passwordIsIcorrect = await bcrypt.compare(oldpassword, user.password);

  // then save new password
  if (user && passwordIsIcorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("password change successful!");
  } else {
    res.status(400);
    throw new Error("cannot change password, old password incorrect!");
  }
});

// this controller is for resetpassword
const forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await user.findOne({ email });

  if (!user) {
    res.status(404);
    throw new error(" user does not exist");
  }

  // create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  
  // hash token before saving to db
  const hashedToken = crypto.createHash("256").update(resetToken).digest("hex");

  res.send("forgot password");
});

// this are my exports...
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  logginstatus,
  updateUser,
  changepassword,
  forgotpassword,
};
