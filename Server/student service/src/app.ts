
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/Database';
import inforouter from './api/route/student.info.route'

const application = express();
application.use(cors({
    origin: "http://localhost:3000",
    credentials: true, //
    methods: ["GET", "POST", "PUT", "DELETE"], //
}));
application.use(cookieParser())
application.use(express.json())
application.use(express.urlencoded({extended:true}))


application.use('/api/student/info/', inforouter)


application.get("/", (req,res)=>res.send("student service is running"));


// database and other configuration question 

connectDatabase();
export default application;