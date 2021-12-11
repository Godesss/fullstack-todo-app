
import mongoose from "mongoose"
const schema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"UserDatas"},
    refreshToken: {type:String,required:true}
})
export const TokenSchema =  mongoose.model("TokenDatas",schema);