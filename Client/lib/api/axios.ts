import axios from "axios";

// Instance for Auth/General Admin (Port 8001)
export const api = axios.create({
  baseURL: "http://localhost:8001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance for Teacher Service (Port 8002)
export const BackendTeacherApi = axios.create({
  baseURL: "http://localhost:8002",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// 
export const BackendTeacherStudentApi = axios.create({
  baseURL: "http://localhost:8003",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export const BackendAuthStudentApi = axios.create({
  baseURL: "http://localhost:8003",
  withCredentials:true,
  headers:{
    "Content-Type":"application/json"
  }
})

