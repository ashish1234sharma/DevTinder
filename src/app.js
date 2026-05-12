const express = require("express");
const { IsAuth } = require("./Middlewares/auth");
const userModel = require("./models/user.model");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

app.post("/public/user", async (req, res) => {
  try {
    const user = new userModel(req.body);

    const createUser = await user.save();

    res
      .status(201)
      .json({
        status: "success",
        message: "User created successfully",
        data: createUser,
      });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message});
  }
});

connectDB()
  .then(() => {
    app.listen(8080, () => {
      console.log("server is running on 8080");
    });
  })
  .catch((err) => {
    console.log("error in DB connection");
  });
