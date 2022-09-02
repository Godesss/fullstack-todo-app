import { validationResult } from "express-validator"
import { ErrorHandler } from "../services/errorService.js"
import userService from "../services/userService.js"
class AuthController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ErrorHandler.badRequest("incorect fields", "formFields", errors))
			}
			const userData = await userService.registration(req.body)
			res.cookie("refreshToken", userData.refreshToken, cookiesOptions)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async login(req, res, next) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(ErrorHandler.badRequest("email or password incorrect", errors.array()))
		}
		try {
			const userData = await userService.login(req.body)
			console.log("userData", userData)
			res.cookie("refreshToken", userData.refreshToken, cookiesOptions)
			console.log("cookies", req.cookies)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async resetPassword(req, res, next) {
		try {
			const { email, password } = req.body
			await userService.resetPassword({ email, password })
			res.json({ message: "ok" })
		} catch (e) {
			next(e)
		}
	}
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			console.log("refreshToken", refreshToken)
			console.log("all cookies", req.cookies)
			const userData = await userService.refresh(refreshToken)
			res.cookie("refreshToken", userData.refreshToken, cookiesOptions)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async validateToken(req, res, next) {
		try {
			const token = await userService.validateToken(req.body.token)
			if (token === null) return res.json({ isValid: false })
			return res.json({ isValid: true })
		} catch (e) {
			next(e)
		}
	}
}
export default new AuthController()

const cookiesOptions = {
	maxAge: 30 * 24 * 60 * 60 * 1000,
	secure: true,
	sameSite: "None",
	httpOnly: true,
}
