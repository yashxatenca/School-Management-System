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

/* ========================
   1. PROXY CONFIGURATION
======================== */
// Crucial in production when deployed behind reverse proxies (Nginx, Render, AWS ALB, Cloudflare)
if (isProduction || process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

/* ========================
   2. CORS CONFIGURATION
======================== */
// Parse comma-separated origins from process.env.ALLOWED_ORIGINS if available
const defaultOrigins = ["http://localhost:3000", "http://localhost:3000"];
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
      origin.trim().replace(/\/$/, ""),
    )
  : [];

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, mobile apps, server-to-server) or matched origins
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

/* ========================
   3. SECURITY & LOGGING
======================== */
app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));

/* ========================
   4. RATE LIMITING
======================== */
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
    environment: process.env.NODE_ENV || "development",
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
