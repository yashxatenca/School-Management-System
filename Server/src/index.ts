import app from './app' 
import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
const server = app.listen(process.env.PORT, () => {   
    console.log(`port running on localhost:${process.env.PORT}`)
});

// 🔥 Graceful Shutdown (Production Level)
const shutdown = async (signal: string) => {
  console.log(`\n⚠️ Received ${signal}. Shutting down gracefully...`);

  try {
    await mongoose.connection.close(false);
    console.log("✅ MongoDB connection closed.");

    server.close(() => {
      console.log("✅ Server closed.");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle Crashes
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => shutdown("SIGTERM")); // Production deploy stop
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});
