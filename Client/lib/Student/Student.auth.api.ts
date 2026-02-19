import { BackendAuthStudentApi } from '../api/axios';

export const login = async (email: string, password: string) => {

    const response = await BackendAuthStudentApi.post('/api/v1/student/auth/login', {
      email,
      password,
    })
    return response.data;   
}

export const logout = async()=>{
    const response = await BackendAuthStudentApi.get("/api/v1/student/auth/logout");
    return response.data;
}
