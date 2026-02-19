"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { api, BackendTeacherApi, BackendTeacherStudentApi } from "@/lib/api/axios";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/app/redux/Slice/authSlice";
import { setTeacher } from "@/app/redux/Slice/teacher.auth.slice";
import { setStudent } from "@/app/redux/Slice/student.authslice";

type Role = "student" | "teacher" | "principal";

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    try {
      // ================= TEACHER LOGIN =================
      if (role === "teacher") {
        const email = form.get("email");
        const password = form.get("password");

        const res = await BackendTeacherApi.post(
          "/api/teacher/auth/login",
          { email, password }
        );

        if (res.data.success) {
          dispatch(setTeacher(res.data.data));
          router.push("/teacher/dashboard");
        }
      }

      // ================= STUDENT LOGIN =================
      else if (role === "student") {
        const studentId = form.get("studentId");
        const password = form.get("password");

        const res = await BackendTeacherStudentApi.post(
          "/api/v1/student/auth/login",
          { studentId, password }
        );
        if(res.data.success){
          dispatch(setStudent(res.data.student));
          router.push("/student/dashboard");


        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // ================= PRINCIPAL GOOGLE LOGIN =================
  const handleGoogleLogin = async (token: string) => {
    try {
      const res = await api.post("/api/auth/admin/login", { token });

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
          <form onSubmit={handleLogin} className="space-y-4">

            {/* TEACHER INPUT */}
            {role === "teacher" && (
              <input
                name="email"
                type="email"
                placeholder="Teacher Email"
                required
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              />
            )}

            {/* STUDENT INPUT */}
            {role === "student" && (
              <input
                name="studentId"
                type="text"
                placeholder="Enter 6 Digit Student ID"
                required
                maxLength={6}
                pattern="\d{6}"
                onInput={(e) =>
                  (e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""))
                }
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500"
              />
            )}

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
