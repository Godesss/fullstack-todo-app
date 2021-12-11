
import jwt from "jsonwebtoken";
import { TokenSchema } from "../models/tokenSchema.js";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken({user,refreshToken}) {
        const tokenData = await TokenSchema.findOne(user)
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await TokenSchema.create({user,refreshToken})
        return token
    }
    async removeToken(refreshToken) {
        const tokenData = await TokenSchema.deleteOne({refreshToken});
        return tokenData
    }
    async findToken(refreshToken) {
        const tokenData = await TokenSchema.findOne({refreshToken});
        return tokenData
    }
    validateAccessToken(token) {
        try{
            const userData = jwt.verify(token,process.env.JWT_ACCESS_KEY);
            return userData
        }
        catch(e) {
            return null
        }
    }
    validateRefreshToken(token) {
        try{
            const userData = jwt.verify(token,process.env.JWT_REFRESH_KEY);
            return userData
        }
        catch(e) {
            return null
        }
    }
}   
export default new TokenService()