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
app.set("trust proxy", 1);

/* ========================
   1. INCOMING REQUEST LOG
======================== */
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});

/* ========================
   2. CORS CONFIG (MUST BE ON TOP)
======================== */
// Hardcoded array + env fallback with trailing slash cleanup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.ORIGIN?.replace(/\/$/, ""), // Trailing slash remove kar dega
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ========================
   3. SECURITY HEADERS & LOGGER
======================== */
app.use(helmet());

const loggerFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(loggerFormat));

/* ========================
   4. RATE LIMITING
======================== */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again in 15 minutes.",
  },
});

app.use(globalLimiter);

/* ========================
   5. BODY PARSING & COOKIES
======================== */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

/* ========================
   6. HEALTH CHECK
======================== */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "School Auth API is running 🚀",
  });
});

/* ========================
   7. ROUTES
======================== */
registeradminroute(app);
registerteacherroute(app);
registerstudentroute(app);

/* ========================
   8. 404 HANDLER
======================== */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

/* ========================
   9. GLOBAL ERROR HANDLER
======================== */
app.use(errorhandler);

export default app;
