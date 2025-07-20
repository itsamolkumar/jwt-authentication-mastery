import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import { userData } from "../Controllers/userController.js";
const userRouter=express.Router();
userRouter.get("/get-data",authMiddleware,userData);
export default userRouter;