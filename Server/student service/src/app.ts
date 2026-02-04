
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const application = express();
application.use(cors({
    origin:"http://localhost:3000"
}));
application.use(cookieParser())
application.use(express.json())
application.use(express.urlencoded({extended:true}));



application.get("/", (req,res)=>res.send("student service is running"));
export default application;