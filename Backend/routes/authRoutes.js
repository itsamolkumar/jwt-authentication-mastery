import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { register,login,logout,verifyOtp,verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from "../Controllers/authController.js";
const authRouter=express.Router();
authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/send-verify-otp",authMiddleware,verifyOtp);
authRouter.post("/verify-account",authMiddleware,verifyEmail);
authRouter.post("/is-auth",authMiddleware,isAuthenticated);
authRouter.post("/send-reset-otp",sendResetOtp);
authRouter.post("/reset-password",resetPassword);



export default authRouter;