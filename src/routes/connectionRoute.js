const express = require("express");
const { IsAuth } = require("../Middlewares/auth");
const userModel = require("../models/user.model");
const connectionModel = require("../models/sendConnection.model");

const connectionRoute = express.Router();

connectionRoute.post("/send/request/:status/:id", IsAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const fromUser = req.user.user;
    const toUser = req.params.id;
    const isCorrectStatus = ["intrested", "rejected"].includes(status);

    if (!isCorrectStatus) {
      return res
        .status(400)
        .json({ status: "failed", message: "status is invalid" });
    }

    if (fromUser === toUser) {
      return res
        .status(400)
        .json({ status: "failed", message: "invalid request" });
    }

    const duplicateRequest = await userModel.find({
      $or: [
        { toUser, fromUser },
        { toUser: fromUser, fromUser: toUser },
      ],
    });

    if(duplicateRequest){
        return res.status(400).json({status:"failed",message:"request already exist"})
    }

    const connectionRequest = new connectionModel({
      fromUser,
      toUser,
      status,
    });

    await connectionRequest.save();

    return res.status(200).json({
      status: "success",
      message: "connection request send successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", message: "something went wrong" });
  }
});

module.exports = connectionRoute;
