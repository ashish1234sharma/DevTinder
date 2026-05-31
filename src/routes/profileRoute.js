const express = require("express")
const { IsAuth }  = require("../Middlewares/auth")
const userModel = require('../models/user.model')
const profileRoute = express.Router()


profileRoute.get("/profile",IsAuth , async (req,res)=>{
    try{
        const { user } = req.user
     

        const userProfile = await userModel.findById(user)

        return res.status(200).json({status:"success",data:userProfile})
    }catch(err){
     return res.status(500).json({status:"failed",message:"something went wrong"})
    }
})



module.exports = profileRoute