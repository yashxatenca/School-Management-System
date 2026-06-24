"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import StudentLogin from "./_components/StudentLoginForm";
import TeacherLogin from "./_components/TeacherLoginForm";
import PrincipalLogin from "./_components/PrincipalLoginForm";

type Role = "student" | "teacher" | "principal";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = searchParams.get("role");

  useEffect(() => {
    const validRoles = ["student", "teacher", "principal"];
    if (!validRoles.includes(role as string)) {
      router.replace("/");
    }
  }, [role, router]);

  const renderLoginModule = () => {
    switch (role) {
      case "teacher":
        return <TeacherLogin />;
      case "principal":
        return <PrincipalLogin />;
      case "admin":
        return <PrincipalLogin />;
      case "student":
        return <StudentLogin />;
      default:
        return null;
    }
  };

  const validRoles = ["student", "teacher", "principal"];
  if (!validRoles.includes(role as string)) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow">
        <h1 className="text-2xl font-bold text-center mb-6 capitalize">
          {role} Login
        </h1>
        {renderLoginModule()}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
