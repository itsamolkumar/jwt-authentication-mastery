import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import User from "../Models/userModel.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

// ✅ REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }


  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPass });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Send Welcome Email
    console.log("✅ Email being sent to:", newUser.email);

    await transporter.sendMail({
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: "Welcome to our website",
  text: `Hello ${name}, welcome to our website! You are registered with ${email}.`,
});
    return res.json({ success: true, message: "Registered successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing login details" });
  }

  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Logged in successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const verifyOtp=async(req,res)=>{
  try{
    const userId=req.authUserId;
    console.log(userId);
    if(!userId){
      return res.json({success:false, message:"Enter valid userId"})
    }

    const currUser=await User.findById(userId);
    if(!currUser){
      return res.json({success:false, message:"user doesn't existed"})
    }
    if(currUser.isAccountVerified){
      return res.json({success:false,message:"User alreay verified"})
    }
    const otp=String(Math.floor(100000 +  Math.random()*900000));
    currUser.verifyOtp=otp;
    currUser.verifyOtpExpireAt=Date.now()+24*60*60*1000;
    await currUser.save();

    await transporter.sendMail({
  from: process.env.SENDER_EMAIL,
  to: currUser.email,
  subject: "Accont verification otp",
  text: `Hello ${currUser.name}, This is your otp to verify yourself-- ${otp}.`,
  html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",currUser.email)

});
res.json({success:true, message:"Otp has been send on user's mail..."})
    
}
  catch(err){
    return res.json({success:false,message:err.message});
  }
}

export const verifyEmail=async(req,res)=>{
  const {otp}=req.body;
  const userId=req.authUserId; 
  if(!userId ||!otp){
    return res.json({success:false, message:"Missing otp details..."});
  }
  try{
    const currUser=await User.findById(userId);
    if(!currUser){
      return res.json({success:false, message:"User doesn't found"})
    }
    if(currUser.verifyOtp==="" || currUser.verifyOtp!==otp){
      return res.json({sucess:false,message:"Invalid Otp" })
    }
    if(currUser.verifyOtpExpireAt<Date.now()){
      return res.json({success:false,message:"Otp has been exired"})
    }
    currUser.isAccountVerified=true;
    currUser.verifyOtp="";
    currUser.verifyOtpExpireAt=0;
    await currUser.save();
    return res.json({success:true,message:"Email successfully verified"});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

export const isAuthenticated=async(req,res)=>{
  try{
    return res.json({success:true});
  }catch(err){
    return res.json({success:false,message:err.message})
  }
}

export const sendResetOtp=async(req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.json({success:false,message:"Please enter a valid email"})
  }
  try{
    const currUser=await User.findOne({email})
    if(!currUser){
      return res.json({success:false,message:"user not found with this email"})
    }
      const otp=String(Math.floor(100000 +  Math.random()*900000));
    currUser.resetOtp=otp;
    currUser.resetOtpExpireAt=Date.now()+24*60*60*1000;
    await currUser.save();

    await transporter.sendMail({
  from: process.env.SENDER_EMAIL,
  to: currUser.email,
  subject: "Password reset otp",
  text: `Hello ${currUser.name},Your OTP for resetting your password is -- ${otp}.
  Use this OTP to proceed with resettig your password`,
  html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",currUser.email)

});
res.json({success:true, message:"Otp has been send on user's mail..."})
  }catch(err){
    return res.json({success:false,message:err.message})
  }
}

export const resetPassword=async(req,res)=>{
  const {email,otp,newPassword}=req.body;
  if(!email || !otp || !newPassword){
    return res.json({success:false,message:"Missing details"})
  }
  try{
    const currUser=await User.findOne({email});
    if(!currUser){
      return res.json({success:false,message:"User not found"})
    }
    if(currUser.resetOtp==="" || currUser.resetOtp!==otp){
      return res.json({success:false,message:"Please enter valid otp"});
    }
    if(currUser.resetOtpExpireAt<Date.now()){
      return res.json({success:false,message:"Otp expired"})
    }
    const hashedPass=await bcrypt.hash(newPassword,10);
    currUser.password=hashedPass;
    currUser.resetOtp="";
    currUser.resetOtpExpireAt=0;
    await currUser.save();
    return res.json({success:true,message:" pasword reset successfully"});
  }catch(err){
  return res.json({success:false,message:err.message})
  }
}