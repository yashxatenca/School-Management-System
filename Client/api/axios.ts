import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  console.log("");
  console.log("Base URL:", config.baseURL);
  console.log("URL:", config.url);
  console.log("Final:", `${config.baseURL}${config.url}`);
  return config;
});
