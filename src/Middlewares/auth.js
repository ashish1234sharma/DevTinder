const IsAuth =(req,res,next)=>{
    token= "xyzsdsd"
    const isAuthorized = token === "xyz"

    if(!isAuthorized){
       res.status(401).send("UnAuthorized User")
    }else{
      next()
    }
}

module.exports ={
    IsAuth
}