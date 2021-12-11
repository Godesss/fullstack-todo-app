
import jwt from "jsonwebtoken";
import { TokenSchema } from "../models/tokenSchema.js";
import { UserSchema } from "../models/userSchema.js";
import bcrypt from 'bcrypt';
import userService from "../services/userService.js";
import {validationResult} from "express-validator"
import { ErrorHandler } from "../services/errorService.js";
class AuthController {
    async registration(req,res,next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest("incorect fields","formFields",errors))
            }
            const userData = await userService.registration(req.body);
            res.cookie("refreshToken",userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }   
        catch(e) {
            next(e)
        }
    }
    async login(req,res,next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ErrorHandler.badRequest("email or password incorrect",errors.array()))
        }
        try {
            const userData = await userService.login(req.body)
            res.cookie("refreshToken",userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }
        catch(e) {
            next(e)
        }    
    }
    async resetPassword(req,res,next) {
        try {
            await userService.resetPassword(req.body.email);
            res.json({message:"ok"})
        }
        catch(e) {
            next(e)
        }
    }
    async setNewPassword(req,res,next) {
        try {
            await userService.setNewPassword(req.body);
        }
        catch(e) {
            next(e)
        }
    }
    async activateLink(req,res,next) {
        try{
            await userService.activateLink(req.body.link);
            return res.json({message:"ok"})
        }
        catch(e){
            next(e)
        }
    }
    async logout(req,res) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie("refreshToken")
            return res.json(token);
        }
        catch(e) {
            next(e)
        }
    }
    async refresh(req,res,next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie("refreshToken",userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }
        catch(e) {
            next(e)
        }
    }
    async validateToken(req,res,next) {
        try{
            const token = await userService.validateToken(req.body.token);
            if(token === null) return res.json({isValid:false})
            return res.json({isValid:true})
        }
        catch(e) {
            next(e)
        }
    }
}
export default new AuthController()
