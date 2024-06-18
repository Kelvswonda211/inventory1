const dotenv = require("dotenv").config({ path: ".env.development" });
// dotenv.config({path:"../backend/.ENV"});
const mongodb= require("mongodb");
const mongoose = require("mongoose");
// const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");
const user_Routes = require("./routes/user_routes");
const error_handler = require("./middleware/error_middleware");
const errorHandler = require("./middleware/error_middleware");
// const cookieparser = require("cookie-parser");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


const app = express();



const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("server running on ${PORT}");
    });
  })
  .catch((err) => console.log(err));

// my middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(bodyParser.json);

// routes for middleware
app.use("/api/users", user_Routes);

// error middleware
app.use(errorHandler);

// routes

app.get("/", (req, res) => {
  res.send("homepage");
});
app.post("/login", (req, res) => {
  res.send("login is succesfull");
});
app.get("/logout", (req, res) => {
  res.send("This will be the logout page");
});
app.post("/register", (req, res) => {
  res.send("registered succesfully");
});
