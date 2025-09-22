require('dotenv').config();
const express=require('express');
const cors = require('cors');
const app=express();
const gen=require('./routes/Main.routes');
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("hello world");
})
app.use('/api/generate',gen);
// app.use('/api/food',foodroutes);
module.exports=app;
