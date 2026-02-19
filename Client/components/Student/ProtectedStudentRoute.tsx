"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function ProtectedStudentRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isAuthenticated, user, authChecked } = useSelector(
    (state: RootState) => state.studentauthstate
  );

  useEffect(() => {
    // 🚫 Don't run anything until auth check completes
    if (!authChecked) return;

    // 🔐 Not logged in → go to login
    if (!isAuthenticated) {
      router.replace("/student/login");
      return;
    }

    // 🚫 Logged in but wrong role
    if (user?.role && user.role !== "student") {
      router.replace("/unauthorized");
      return;
    }
  }, [authChecked, isAuthenticated, user?.role, router]);

  // ⏳ While checking auth → show loader
  if (!authChecked) {
    return <FullScreenLoader />;
  }

  // 🚫 After check, not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // 🚫 Wrong role
  if (user?.role && user.role !== "student") {
    return null;
  }

  // ✅ All good
  return <>{children}</>;
}
