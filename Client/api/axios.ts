import axios from "axios";
console.log(process.env.NEXT_ORIGIN);
// Instance for Auth/General Admin (Port 8001)
export const api = axios.create({
  baseURL: process.env.NEXT_ORIGIN as string,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
