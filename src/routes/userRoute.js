const express = require("express");
const { IsAuth } = require("../Middlewares/auth");
const connectionModel = require("../models/sendConnection.model");

const userRouter = express.Router();

userRouter.get("/user/requests", IsAuth , async (req,res)=>{
    try{
      const loggedInUser = req.user.user

      const allconnectionRequests = await connectionModel.find({toUser:loggedInUser, status:"intrested"}).populate("fromUser" , "firstName lastName")

      if(allconnectionRequests.length !== 0){
         return res.status(200).json({status:"success",data:allconnectionRequests})
      }else{
        return res.status(200).json({status:"success",message:"no requested available"})
      }

      

    }catch(err){
        return res.status("failed").json({status:"failed",message:"something went wrong"})
    }
})

userRouter.get("/user/connections", IsAuth, async (req, res) => {
  try {
    const loggedInUser = req.user.user;
    const findConnections = await connectionModel
      .find({ toUser: loggedInUser, status: "accepted" })
      .populate("fromUser", "firstName lastName");

      if(findConnections.length !== 0 ){
         return res.status(200).json({ status: "success", data: findConnections });
      }else{
        return res.status(200).json({ status: "success", message:"no connections available"});
      }

    
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

module.exports = userRouter;
