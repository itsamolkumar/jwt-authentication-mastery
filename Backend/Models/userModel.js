import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{type:String, required:true,},
    email:{type:String, requird:true, unique:true,},
    password:{type:String, required:true,},
    verifyOtp:{type:String, default:''},
    verifyOtpExpireAt:{type:Number, default:0},
    resetOtp:{type:String, default:''},
    resetOtpExpireAt:{type:Number, default:0},
    isAccountVerified:{type:Boolean, default:false},

});
const User =mongoose.model.user || mongoose.model("User",userSchema);
export default User;