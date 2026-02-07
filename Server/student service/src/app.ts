
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import inforouter from './api/route/student.info.route'

const application = express();
application.use(cors({
    origin:"http://localhost:3000"
}));
application.use(cookieParser())
application.use(express.json())
application.use(express.urlencoded({extended:true}))


application.use('/api/student/info/', inforouter)


application.get("/", (req,res)=>res.send("student service is running"));
export default application;