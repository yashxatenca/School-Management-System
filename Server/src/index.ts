import dotenv from "dotenv";
dotenv.config(); // Must be called before reading process.env or importing app

import app from "./app";
import mongoose from "mongoose";
import connectDB from "./config/Database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Establish DB Connection prior to serving traffic
    await connectDB();

    // 2. Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);

      server.close(async () => {
        console.log("✅ HTTP server closed.");
        try {
          await mongoose.connection.close(false);
          console.log("✅ MongoDB connection closed.");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error closing MongoDB connection:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      shutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason) => {
      console.error("❌ Unhandled Rejection:", reason);
      shutdown("unhandledRejection");
    });
  } catch (err) {
    console.error("❌ Failed to start application:", err);
    process.exit(1);
  }
};

startServer();
