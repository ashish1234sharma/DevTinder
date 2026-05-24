const express = require("express");
const { IsAuth } = require("./Middlewares/auth");
const userModel = require("./models/user.model");
const connectDB = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.post("/public/user", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, skill } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      skill,
    });

    const createUser = await user.save({
      firstName,
      lastName,
      email,
      password,
      age,
      skill,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: createUser,
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
});

app.post("/public/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
    }

    await user.isValidUser(password);
    const token = await user.addTokenInCookies()


    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ status: "success", message: "Login successfully", token });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "Failed", message: err.message });
  }
});

app.get("/profile", IsAuth, async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    return res.status(200).json({ status: "Success", data: user });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "Failed", message: "Something went wrong" });
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(8080, () => {
      console.log("server is running on 8080");
    });
  })
  .catch((err) => {
    console.log("error in DB connection", err.message);
  });
