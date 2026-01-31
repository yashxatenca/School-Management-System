"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "teacher" | "student";
}) {
  const router = useRouter();

  const { isAuthenticated, user, authChecked } = useSelector(
    (state: RootState) => state.authstate
  );

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      router.replace(`/login?role=${role}`);
      return;
    }

    if (user?.role !== role) {
      router.replace("/unauthorized");
    }
  }, [authChecked, isAuthenticated, user?.role, role, router]);

  // 🔄 LOADER ONLY DURING AUTH CHECK
  if (!authChecked) {
    return <FullScreenLoader />;
  }

  // ⛔ Block rendering if unauthorized
  if (!isAuthenticated || user?.role !== role) {
    return null;
  }

  // ✅ Authorized
  return <>{children}</>;
}
