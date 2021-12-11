import { ErrorHandler } from "../services/errorService.js";

export const errorMiddle = (err,req,res,next) => {
    console.log(err)
    if(err instanceof ErrorHandler) {
        return res.status(err.status).json({message:err.message,errors:err.errors,type:err.type})
    }
    return res.status(500).json({message:"Error on server site please retry",type:"server"})
    
}