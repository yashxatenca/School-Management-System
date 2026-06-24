import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { setAdmin } from "@/app/redux/Slice/authSlice";
import { api } from "@/api/axios";

export default function PrincipalLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGoogleLogin = async (token: string) => {
    try {
      const res = await api.post("/api/v1/auth/admin/login", { token });
      if (res.data?.success) {
        dispatch(setAdmin(res.data.user));
      }
      router.push("/admin/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(res) => handleGoogleLogin(res.credential!)}
        onError={() => alert("Google Login Failed")}
      />
    </div>
  );
}
