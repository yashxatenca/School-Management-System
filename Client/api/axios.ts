import axios from "axios";

// Instance for Auth/General Admin (Port 8001)
export const api = axios.create({
  baseURL: process.env.NEXT_ORIGIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
