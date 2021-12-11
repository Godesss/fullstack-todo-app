
import mongoose from "mongoose"

const schema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    date: {type:Date,default:Date.now},
    isActivated:{type:Boolean,default:false},
    activationLink:{type:String,required:true},
})

export const UserSchema =  mongoose.model("UserDatas",schema);