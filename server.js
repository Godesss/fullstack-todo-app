
import express from "express"
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import path from "path"
const __dirname = path.resolve()

import registration from "./routes/auth.js"
import tasks from "./routes/tasks.js"
import { errorMiddle } from "./middlewares/errorMiddle.js";

const app = express();

const corsOptions = {
    credentials:true,
    origin:"http://localhost:3000"
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions))
app.use(cookieParser());

app.use("/user",registration)
app.use("/methods",tasks)
app.use(errorMiddle)
app.use(express.static(path.join(__dirname,"dist")));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

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