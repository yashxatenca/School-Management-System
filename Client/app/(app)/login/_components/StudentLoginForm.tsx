import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setStudent } from "@/app/redux/Slice/student.authslice";
import { setStudentClassDetail } from "@/app/redux/Slice/StudentClass.slice";
import { api } from "@/api/axios";

export default function StudentLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const studentId = form.get("studentId");
    const password = form.get("password");

    try {
      const res = await api.post("/api/v1/auth/student/login", {
        studentId,
        password,
      });
      if (res.data.success) {
        dispatch(setStudent(res.data.data));
        dispatch(setStudentClassDetail(res.data.data.classId));
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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
  );
}
