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

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: createUser,
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const userList = await userModel.find({});
    res.status(200).json({ status: "success", data: userList });
  } catch (err) {
    res.status(500).json({ status: "failed", message: "Something went wrong" });
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json({
      status: "success",
      message: "user updated successfully",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({ status: "Failed", message: "something went wrong" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const deleteUser = await userModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: "success", message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "Failed", message: "Something went wrong" });
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
