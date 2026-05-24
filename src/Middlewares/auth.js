const jwt = require("jsonwebtoken");

const IsAuth = (req, res, next) => {
  try {
    const token = req.cookies.token

    if(!token){
      return res.status(401).json({status:"Failed",message:"Unauthorized user"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded
      next();
  } catch (err) {
    return res
      .status(404)
      .json({ status: "Failed", message: "Something went wrong" });
  }
};

module.exports = {
  IsAuth,
};
