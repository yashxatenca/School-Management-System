import mongoose from "mongoose";
import { config } from "dotenv";
config(); // Load environment variables from .env file

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.URL as string, {
      autoIndex: false, // Production mein false hi rakhna chahiye (fast boot ke liye)

      // 🚀 HIGH TRAFFIC OPTIMIZATIONS 🚀
      maxPoolSize: 500, // Default 100 hota hai. Isko 500 kiya taaki 500 queries ek saath DB par process ho sakein.
      minPoolSize: 50, // 50 connections hamesha open aur ready rahenge, taaki achanak traffic spike aane par connection banane mein time waste na ho.

      serverSelectionTimeoutMS: 5000, // 5 seconds mein DB na mile toh timeout
      socketTimeoutMS: 45000, // Inactive connection ko 45 seconds baad close karega
      family: 4, // Force IPv4. Kabhi kabhi IPv6 ki wajah se DNS resolution mein delay ya timeout aata hai.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle Mongo Errors
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(
        "⚠️ MongoDB Disconnected! Mongoose will automatically try to reconnect.",
      );
    });
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1); // Exit process if initial DB connection fails
  }
};

export default connectDB;
