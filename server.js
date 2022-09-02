import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
dotenv.config()

import { errorMiddle } from "./middlewares/errorMiddle.js"
import registration from "./routes/auth.js"
import tasks from "./routes/tasks.js"

const app = express()

const corsOptions = {
	origin: ["http://localhost:3000", "*", "https://shimmering-chebakia-2391d8.netlify.app"],
	credentials: true,
}
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.options("*", cors(corsConfig))
app.use("/user", registration)
app.use("/methods", tasks)
app.use(errorMiddle)

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
