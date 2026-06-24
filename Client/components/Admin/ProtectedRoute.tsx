"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin";
}) {
  const router = useRouter();

  const { isAuthenticated, user, authChecked } = useSelector(
    (state: RootState) => state.authstate,
  );

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      // 🛠️ FIX: Change this from `/login?role=${role}` to `/`
      // This ensures that unauthenticated users (including those who just logged out)
      // are always sent directly to the home page.
      router.replace("/");
      return;
    }

    if (user?.role !== role) {
      // Optional: You can change this to "/" as well if you don't have an unauthorized page
      router.replace("/");
    }
  }, [authChecked, isAuthenticated, user?.role, role, router]);

  if (!authChecked) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated || user?.role !== role) {
    return null;
  }

  return <>{children}</>;
}
