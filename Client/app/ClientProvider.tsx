"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { store } from "./redux/store";
import GlobalLoader from "@/components/ui/GlobalLoader";
import AdminAuthBootstrap from "@/components/Admin/AdminAuthBootstrap";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <GlobalLoader />
          <AdminAuthBootstrap />
          {children}
        </QueryClientProvider>
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
}
