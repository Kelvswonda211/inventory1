const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " dear user, please add a name!"],
    },
    email: {
      type: String,
      required: [true, " dear user, please add an email!"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please enter a valid email!",
      ],
    },
    password: {
      type: String,
      required: [true, " dear user, please add a password!"],
      minLength: [6, "password length must be up to 6 characters"],
      // maxLength: [36, "password length must not be more than 36 characters"],
    },

    Photo: {
      type: String,
      required: [true, " dear user, please add a photo!"],
      default: "img/android-chrome-512x512.png",
    },

    Phonenumber: {
      type: String,
      default: "+234",
    },

    Bio: {
      type: String,
      maxLength: [70, "bio should not exceed 70 characters"],
      default: "say something about yourself!",
    },
  },
  {
    timestamps: true,
  }
);
// encrypt password before saving to db
userSchema.pre("save", async function (next) {
  if (!this.modified("password")) {
    return next();
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
