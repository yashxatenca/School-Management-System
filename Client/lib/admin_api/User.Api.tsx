import { api } from "../axios";
export async function LogoutUser(){
    const res = await api.post("/api/auth/admin/adminlogout");
    console.log("LOgout user run ", res.data)
    return res.data;

}

