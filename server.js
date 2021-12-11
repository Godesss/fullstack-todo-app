
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
app.use(function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "YOUR_URL"); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: true,
}));

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