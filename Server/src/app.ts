import express, { Application, Request, Response, NextFunction } from "express";
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
   SECURITY HEADERS
======================== */
// Helmet secures HTTP headers (prevents XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

/* ========================
   LOGGER
======================== */
// Detailed logging for production, colored concise logging for dev
const loggerFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(loggerFormat));

/* ========================
   RATE LIMITING
======================== */
// General Rate Limiter: max 100 requests per 15 minutes per IP
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
   MIDDLEWARES & BODY PARSING
======================== */
// Bound body size to 10kb to block memory-exhaustion (DoS) payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

/* ========================
   CORS CONFIG
======================== */
console.log(process.env.ORIGIN);
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
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

registeradminroute(app); // Admin routes
registerteacherroute(app); // Teacher routes
registerstudentroute(app); // Student routes

/* ========================
   404 HANDLER
======================== */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

/* ========================
   GLOBAL ERROR HANDLER
======================== */
app.use(errorhandler);

export default app;
