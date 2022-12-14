import express from "express"
import { body } from "express-validator"

import authController from "../controllers/authController.js"
const router = express.Router()
router.post(
	"/registration",
	body("name").isLength({ min: 2 }),
	body("password").isLength({ min: 7 }),
	body("email").isEmail(),
	authController.registration
)

router.post("/login", body("password").isLength({ min: 7 }), body("email").isEmail(), authController.login)
router.post("/resetpassword", authController.resetPassword)
router.post("/validatetoken", authController.validateToken)
router.get("/refresh", (req, res, next) => {
	console.log(req.cookies)
	authController.refresh(req, res, next)
})

export default router
