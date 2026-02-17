"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import FullScreenLoader from "@/components/FullScreenLoader";

export default function ProtectedStudentRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isAuthenticated, user, authChecked } = useSelector(
    (state: RootState) => state.studentauthstate   // 👈 student slice
  );

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      router.replace("/student/login");
      return;
    }

    if (user?.role !== "student") {
      router.replace("/unauthorized");
    }
  }, [authChecked, isAuthenticated, user?.role, router]);

  if (!authChecked) return <FullScreenLoader />;

  if (!isAuthenticated || user?.role !== "student") return null;

  return <>{children}</>;
}
