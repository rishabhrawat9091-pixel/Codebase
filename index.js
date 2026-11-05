import express from "express"

import cors from "cors"
import Db from "./Database/dbConnect.js";
import dotenv from "dotenv"
import ask from "./router/ask.router.js"
const app=express();

dotenv.config();
Db();

app.use(cors());

app.use(express.json());


app.use("/api",ask);

// app.use("/",(req,res)=>{
//     res.status(200).json({"message":"backend is working"});
// })

const Port=8080;

app.listen(Port,()=>{
    console.log(`server is running at http://localhost:${Port}`)
})