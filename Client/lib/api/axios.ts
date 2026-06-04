import axios from "axios";

// Instance for Auth/General Admin (Port 8001)
export const api = axios.create({
  baseURL: "http://localhost:8001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
