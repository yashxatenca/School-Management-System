import { GoogleGenAI } from "@google/genai";
const key = process.env.LLM_API;

if (!key) {
  throw new Error(
    "CRITICAL ERROR: The LLM_API environment variable is not defined!",
  );
}

export const ai = new GoogleGenAI({ apiKey: key });
