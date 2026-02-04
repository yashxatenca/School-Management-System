import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorhandler } from "./core/errors/errorHandler";
import teacherroute from "./api/route/teacher.crud";
import teacherauthroute from './api/route/auth.teacher.route'
import { connectDatabase } from "./config/Database";

const app: Application = express();

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDatabase();

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "admin-teacher api is working fine",
  });
});

app.get("/home", (req: Request, res: Response) => {
  return res.status(200).send("this is the route just for home");
});

app.use("/api/admin/teacher",(req,res,next)=>{
  console.log(" the req is comming from", req.url, req.method)
  console.log(" the incoming ip is",req.ip)
  next()

} , teacherroute);

app.use("/api/teacher/auth",teacherauthroute )
app.use((req:Request,res:Response,next:NextFunction)=>{
  console.log("some error accoured")
  next();
}, errorhandler);

export default app; // 👈 THIS LINE FIXES REDECLARE ISSUE
