const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { IsAuth } = require("../Middlewares/auth");

const authRoute = express.Router();

authRoute.post("/public/user", async (req, res) => {
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

authRoute.post("/public/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "user not found" });
    }

    await user.isValidUser(password);
    const token = await user.addTokenInCookies();

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
    return res.status(500).json({ status: "Failed", message: err.message });
  }
});

authRoute.get("/usersList", async (req, res) => {
  try {
    const userList = await userModel.find();

    return res.status(200).json({ status: "success", data: userList });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", message: "something went wrong" });
  }
});

authRoute.patch("/updateUser", IsAuth, async (req, res) => {
  try {
    const { user } = req.user;

    const updateUser = await userModel.findByIdAndUpdate(user, req.body);

    return res
      .status(200)
      .json({
        status: "success",
        message: "user updated successfully",
        data: updateUser,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", message: "something went wrong" });
  }
});

authRoute.delete("/deleteUser/:id", IsAuth, async (req, res) => {
  try {
     const userId = req.params.id

     const deleteUser = await userModel.findByIdAndDelete(userId)

     return res.status(200).json({status:'success',message:"user deleted successfully",data:deleteUser})

  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

authRoute.post("/logOut" , async (req,res)=>{
    try{

       await res.clearCookie("token")

       return res.status(200).json({status:"success",message:"user logout successfully"})

    }catch(err){
        return res.status(500).json({status:"failed",message:"something went wrong"})
    }
})

module.exports = authRoute;
