const express = require("express");
const { IsAuth } = require("../Middlewares/auth");
const userModel = require("../models/user.model");
const connectionModel = require("../models/sendConnection.model");

const connectionRoute = express.Router();

connectionRoute.post("/request/send/:status/:id", IsAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const fromUser = req.user.user;
    const toUser = req.params.id;
    const isCorrectStatus = ["intrested", "rejected"].includes(status);

    // correct status check

    if (!isCorrectStatus) {
      return res
        .status(400)
        .json({ status: "failed", message: "status is invalid" });
    }

    // same user check

    if (fromUser === toUser) {
      return res
        .status(400)
        .json({ status: "failed", message: "invalid request" });
    }

    // duplicate request check

    const duplicateRequest = await connectionModel.findOne({
      $or: [
        { toUser, fromUser },
        { toUser: fromUser, fromUser: toUser },
      ],
    });

    if (duplicateRequest) {
      return res
        .status(400)
        .json({ status: "failed", message: "request already exist" });
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

connectionRoute.post("/request/review/:status/:id",IsAuth,async (req, res) => {
    try {
      const loggedInUser = req.user.user;
      let status = req.params.status;
      let toUser = req.params.id;
      const isValidStatus = ["accepted", "rejected"];

      const isValidConnectionRequest = await connectionModel.findOne({
        $or: [{ fromUser: toUser, toUser:loggedInUser, status: "intrested" }],
      });

      if (!isValidConnectionRequest) {
        return res
          .status(404)
          .json({ status: "failed", message: "request not found" });
      }
      if (!isValidStatus.includes(status)) {
        return res
          .status(400)
          .json({ status: "failed", message: "status is invalid" });
      }
      if (loggedInUser === toUser) {
        return res
          .status(400)
          .json({ status: "failed", message: "invalid request" });
      }

      isValidConnectionRequest.status = status

      await isValidConnectionRequest.save()

      return res.status(200).json({status:"success",message:"request "  + status + " succesfully"})

    } catch (err) {
      return res.status(500).json({ status: "failed", message: err.message });
    }
  },
);


module.exports = connectionRoute;
