"use client";
import { Menu, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { logoutTeacher } from "@/app/redux/Slice/teacher.auth.slice";
import { useMutation } from "@tanstack/react-query";
import { LogoutUser } from "@/lib/admin_api/TeacherApi";
import { useRouter } from "next/navigation";

interface Props {
  setOpen: (open: boolean) => void;
}

export default function TeacherHeader({ setOpen }: Props) {
  const { user } = useSelector((state: RootState) => state.teacherauthstate);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: LogoutUser,
    onSuccess: () => {
      dispatch(logoutTeacher());
      router.replace("/");
    },
  });

  return (
    <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 backdrop-blur-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 rounded-lg lg:hidden hover:bg-gray-100 transition"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
          {user?.name}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "Teacher"}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role || "Faculty"}
          </p>
        </div>

        <button
          onClick={() => logoutMutation.mutate()}
          className="p-2 rounded-lg hover:bg-red-50 transition text-red-600 hover:text-red-700"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}