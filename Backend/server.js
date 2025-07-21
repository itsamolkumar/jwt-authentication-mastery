import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
const app=express();

const port=process.env.PORT || 8000;
const allowedOrigins=["https://jwt-authentication-mastery-lpcj-git-main-amol-kumars-projects.vercel.app"]
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

//Api endPoints
app.get("/",(req,res)=>{res.send("It's working")})
app.use('/api/auth',authRouter)
app.use("/api/user",userRouter);

app.listen(port,()=>console.log(`listening at port-${port}`))



