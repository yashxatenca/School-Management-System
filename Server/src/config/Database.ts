import mongoose from "mongoose";
import { config } from "dotenv";
config(); // Load environment variables from .env file
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.URL as string, {
      autoIndex: false, // disable in production
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle Mongo Errors
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected!");
    });

  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1); // Exit process if DB fails
  }
};

export default connectDB;
