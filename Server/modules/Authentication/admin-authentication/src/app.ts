import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorhandler } from "./core/errors/errorHandler";
import adminroute from "./api/route/auth.route";
import { connectDatabase } from "./config/Database";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDatabase();

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "admin-authentication api is working fine",
  });
});

app.get("/home", (req: Request, res: Response) => {
  return res.status(200).send("this is the route just for home");
});

app.use("/api/auth/admin",(req,res, next)=>{
console.log(req.url);
console.log(req.ip);
next()
} , adminroute);
app.use(errorhandler);

export default app; // 👈 THIS LINE FIXES REDECLARE ISSUE
