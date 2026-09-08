import mongoose from "mongoose";
import { config } from "dotenv";
config(); // Load environment variables from .env file

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.URL as string, {
      autoIndex: false, 

    
      maxPoolSize: 500, 
      minPoolSize: 50, 

      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      family: 4, 
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

   
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
    process.exit(1); 
  }
};

export default connectDB;
