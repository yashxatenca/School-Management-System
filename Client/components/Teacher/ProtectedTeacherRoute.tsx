"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function TeacherProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isAuthenticated, user, authChecked } = useSelector(
    (state: RootState) => state.teacherauthstate   // 👈 teacher slice
  );
  console.log(user)
  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      router.replace("/teacher/login");
      return;
    }

    if (user?.role !== "teacher") {
      router.replace("/unauthorized");
    }
  }, [authChecked, isAuthenticated, user?.role, router]);

  if (!authChecked) return <FullScreenLoader />;

  if (!isAuthenticated || user?.role !== "teacher") return null;

  return <>{children}</>;
}
