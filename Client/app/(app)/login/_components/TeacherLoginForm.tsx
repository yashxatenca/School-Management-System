import { useRouter } from "next/navigation";
import { loginTeacher } from "@/lib/Admin/TeacherApi";

export default function TeacherLogin() {
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string | null;
    const password = form.get("password") as string | null;

    try {
      const res = await loginTeacher(email, password);
      if (res.success) {
        router.push("/teacher/dashboard");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Teacher Email"
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
  );
}
