
import mongoose from "mongoose";
import { config } from "dotenv";
config()

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURL = process.env.URL;

    if (!mongoURL) {
      throw new Error("MongoDB URL not found in environment variables");
    }

    await mongoose.connect(mongoURL);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
