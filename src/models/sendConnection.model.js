const mongoose = require("mongoose")

const connectionModel = new mongoose.Schema({
    fromUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    toUser : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    status:{
        type:String,
        enum:["intrested","ignore","accepted","rejected"],
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("connectionModel",connectionModel)