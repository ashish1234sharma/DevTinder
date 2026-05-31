const express = require("express");
const { IsAuth } = require("./Middlewares/auth");
const userModel = require("./models/user.model");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoute")
const profileRoute = require("./routes/profileRoute")
const connectionRoute = require("./routes/connectionRoute")
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

app.use("/",authRoute)
app.use("/",profileRoute)
app.use("/", connectionRoute)



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
