import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
dotenv.config()

import path from "path"
const __dirname = path.resolve()

import { errorMiddle } from "./middlewares/errorMiddle.js"
import registration from "./routes/auth.js"
import tasks from "./routes/tasks.js"

const app = express()

const corsOptions = {
	origin: ["http://localhost:3000"],
	credentials: true,
}
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))

app.use("/user", registration)
app.use("/methods", tasks)
app.use(errorMiddle)
app.use(express.static(path.join(__dirname, "dist")))

const start = async () => {
	try {
		app.listen(process.env.PORT || 3000, () => {
			console.log("server started")
		})
		await mongoose.connect(process.env.MONGO_URL)
	} catch (e) {
		console.log(e.message)
	}
}

start()
