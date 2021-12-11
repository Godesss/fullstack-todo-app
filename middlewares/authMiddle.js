
import { ErrorHandler } from "../services/errorService.js";
import tokenService from "../services/tokenService.js"
export const authMiddle = (req,res,next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return next(ErrorHandler.unAuthorizedUser())
        }
        const accessToken = authorizationHeader.split(" ")[1]
        if(!accessToken) {
            return next(ErrorHandler.unAuthorizedUser())
        }
        const userData  = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            return next(ErrorHandler.unAuthorizedUser())
        }
        req.user = userData;
        next()
    }
    catch(e) {
        return next(ErrorHandler.unAuthorizedUser())
    }
}