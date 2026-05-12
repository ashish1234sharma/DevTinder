const mongoose = require("mongoose")

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://ashishsharma150815_db_user:Ku0iGdW583ypdhFc@cluster0.b9olmhr.mongodb.net/")
}



module.exports = connectDB