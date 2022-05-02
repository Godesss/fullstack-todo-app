
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { UserDto } from '../dto/userDto.js';

import { UserSchema } from "../models/userSchema.js";
import { ErrorHandler } from './errorService.js';
import tokenService from "./tokenService.js";
import jwt from "jsonwebtoken";

class UserService {
    async registration({name,email,password}) {
        const candidate = await UserSchema.findOne({email});
        if(candidate) {
            throw ErrorHandler.badRequest("Such email already is used","email")
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        const newUser = await UserSchema.create({
            name,
            password:hashedPassword,
            email
        })
        
        const userDto = new UserDto(newUser);
        const {refreshToken,accessToken} = tokenService.generateTokens({...userDto});
        await tokenService.saveToken({user:userDto.id,refreshToken})
        
        return {
            accessToken,
            refreshToken,
            user: userDto
        }
    }
    async login({email,password}) {
        const user = await UserSchema.findOne({email});
        if(!user) throw ErrorHandler.badRequest("email or password incorrect","formFields")

        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword) throw ErrorHandler.badRequest("email or password incorrect","formFields");
        
        const userDto = new UserDto(user);
        const {refreshToken,accessToken} = tokenService.generateTokens({...userDto});
        await tokenService.saveToken({user:userDto.id,refreshToken})
        
        return {
            accessToken,
            refreshToken,
            user: userDto
        }

    }
    async resetPassword({email,password}) {
        const user = await UserSchema.findOne({email});
        if(!user) throw ErrorHandler.badRequest("email or password incorrect","formFields")
        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword
        await user.save();
    }
    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ErrorHandler.unAuthorizedUser()
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ErrorHandler.unAuthorizedUser()
        }
        const user = await UserSchema.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken({user:userDto.id,refreshToken:tokens.refreshToken})
        return {...tokens, user: userDto}
    }
    async validateToken(token) {
        const isValid = await tokenService.validateAccessToken(token);
        return isValid
    }
} 
export default new UserService()

