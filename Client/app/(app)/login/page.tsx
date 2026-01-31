"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import {api, BackendTeacherApi} from "@/lib/axios";

import { useDispatch } from "react-redux";
import { setAdmin } from "@/app/redux/Slice/authSlice";
import {setTeacher } from '@/app/redux/Slice/teacher.auth.slice'

type Role = "student" | "teacher" | "principal";

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";

  const router = useRouter();
  const dispatch = useDispatch();

  // ================= EMAIL + PASSWORD LOGIN =================
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    try {
      if(role === "teacher"){
        const res = await BackendTeacherApi.post("/api/teacher/auth/login", {
        email,
        password,
        role,
      });

      if(res.data.success){
        dispatch(setTeacher(res.data.data));
        router.push("/teacher/dashboard")
      }

      
      }
     else{
       const res = await api.post("/api/student/auth/login", {
        email,
        password,
        role,
      });

      console.log(res.data)
     }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // ================= GOOGLE LOGIN (PRINCIPAL) =================
  const handleGoogleLogin = async (token: string) => {
    try {
      const res = await api.post("/api/auth/admin/login", {
        token,
      });

      if (res.data?.success) {
        dispatch(setAdmin(res.data.user));
      }

      router.push("/admin/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow">
        <h1 className="text-2xl font-bold text-center mb-6 capitalize">
          {role} Login
        </h1>

        {role === "principal" ? (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => handleGoogleLogin(res.credential!)}
              onError={() => alert("Google Login Failed")}
            />
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
