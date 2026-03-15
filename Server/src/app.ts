import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorhandler } from "./core/errors/errorHandler";
import { registeradminroute } from './route/Admin/admin.route'
import teacherRoutes from "./modules/auth/Teacher/route/teacher.auth.routes";
import studentRoutes from './modules/auth/Student/route/student.auth.route'
import connectDB from "./config/Database";
import teacherprofileRoute from './modules/profile/Teacher/teacher.profile.route'


const app: Application = express();

/* ========================
   MIDDLEWARES
======================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

/* ========================
   CORS CONFIG
======================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* ========================
   HEALTH CHECK
======================== */

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "School Auth API is running 🚀",
  });
});

/* ========================
   ROUTES
======================== */
registeradminroute(app); // for admin
app.use("/api/v1/auth/teacher", teacherRoutes);  // for teacher 
app.use("/api/v1/auth/student", studentRoutes); // for student
app.use("/api/v1/teacher/profile", teacherprofileRoute);
/* ========================
   404 HANDLER
======================== */
/* ========================
   GLOBAL ERROR HANDLER
======================== */

app.use(errorhandler);

export default app;