const express = require('express')

const app = express()

app.use("/hello",(req,res)=>{
    res.send("hello from server")
})

app.use("/test",(req,res)=>{
    res.send("testing server")
})

app.listen(8080,()=>{
    console.log("server is running on 8080")
})