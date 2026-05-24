const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    skill: {
      type: [String],
      validate(value) {
        if (value.length > 5) {
          throw new Error("limit exceeded for skills");
        }
      },
    },
  },
  {
    timestamps: true,
    version: true,
  },
);
userSchema.methods.isValidUser = async function (password) {
  const isValidUser = await bcrypt.compare(password, this.password);
  
  
  if (!isValidUser) {
    throw new Error("Invalid credentials");
  }

  return true;

};

userSchema.methods.addTokenInCookies = async function (){
      const token = jwt.sign({ user: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1D",
      });
  
   return token
}

module.exports = mongoose.model("User", userSchema);
