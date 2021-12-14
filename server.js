
import express from "express"
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import registration from "./routes/auth.js"
import tasks from "./routes/tasks.js"
import { errorMiddle } from "./middlewares/errorMiddle.js";

const app = express();
app.use(cors({
    credentials:true,
    preflightContinue: true,
    origin: "http://localhost:3000"
}));
app.use(function(request, response, next){

    response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    response.header("Access-Control-Allow-Credentials", true);
    if (reqest.method === 'OPTIONS') {
        response.status(200).send();        
    }
    else {
        next();
    }
});
/*app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next();
})*/
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/user",registration)
app.use("/methods",tasks)
app.use(errorMiddle)
const start =  async () => {
    try {
        app.listen(process.env.PORT || 3000, ()=>{console.log("server started")})
        await mongoose.connect(process.env.MONGO_URL);
    }
    catch(e) {
        console.log(e.message)
    }
}
start()