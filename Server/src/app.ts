import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { errorhandler } from "./core/errors/errorHandler";
import { registeradminroute } from "./route/Admin/admin.route";
import { registerteacherroute } from "./route/Teacher/teacher.route";
import { registerstudentroute } from "./route/Student/student.route";

const app: Application = express();
const isProduction = process.env.NODE_ENV === "production";


if (isProduction || process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
      origin.trim().replace(/\/$/, ""),
    )
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
     
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (!isProduction && origin.includes("localhost"))
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(`CORS policy violation: Origin ${origin} not allowed`),
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);


app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // Higher threshold in dev to prevent blocking during active testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again in 15 minutes.",
  },
});

app.use(globalLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "School Auth API is running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});


registeradminroute(app);
registerteacherroute(app);
registerstudentroute(app);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});


app.use(errorhandler);

export default app;
