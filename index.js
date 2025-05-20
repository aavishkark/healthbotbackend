const express = require('express');
const { connection } = require('./db');
const { userRouter } = require('./Routes/users.route')
const app=express();
const cors = require('cors');
app.use(cors());
app.use(express.json())
app.use('/',userRouter)
app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log("Connected to Mongo Atlas")
    }
    catch(err){
        console.log(err)
    }
})
