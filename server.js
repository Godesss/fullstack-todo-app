
import express from "express"
import path from "path"
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import registration from "./routes/auth.js"
import tasks from "./routes/tasks.js"
import { errorMiddle } from "./middlewares/errorMiddle.js";

const app = express();
const __dirname = path.resolve()
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: "https://todoapp231.herokuapp.com",
}));

app.use("/user",registration)
app.use("/methods",tasks)
app.use(errorMiddle)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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