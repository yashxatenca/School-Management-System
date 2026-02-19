"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import{ api } from "@/lib/api/axios";
import { setAdmin, logoutAdmin } from "@/app/redux/Slice/authSlice";
import { useEffect } from "react";

const fetchAdmin = async () => {
  const res = await api.get("/api/auth/admin/adminuser");
  return res.data.user;
};

export default function AdminAuthBootstrap() {
  const dispatch = useDispatch();

  const {
    data: user,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["admin-auth"],
    queryFn: fetchAdmin,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // ✅ SUCCESS SIDE-EFFECT
  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setAdmin(user));
    }
  }, [isSuccess, user, dispatch]);

  // ❌ ERROR SIDE-EFFECT
  useEffect(() => {
    if (isError) {
      dispatch(logoutAdmin());
    }
  }, [isError, dispatch]);

  return null;
}
