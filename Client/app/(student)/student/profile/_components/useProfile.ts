// src/hooks/useStudentProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfileApi,
  upsertProfileApi,
  StudentProfileData,
} from "./profile.api";
import { toast } from "react-toastify";

// 1. GET Profile Hook (Data fetch karne ke liye)
export const useGetStudentProfile = (studentId: string | undefined) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentProfile", studentId],
    queryFn: () => fetchProfileApi(studentId!),
    enabled: !!studentId, // Query tabhi chalegi jab studentId available ho
  });

  return {
    profiledata: data,
    isLoading,
    isError,
  };
};

// 2. UPDATE Profile Hook (Data save/update karne ke liye)
export const useUpdateStudentProfile = (studentId: string | undefined) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<StudentProfileData>) =>
      upsertProfileApi(studentId!, data),
    onSuccess: () => {
      // Success hone par cache ko invalidate karein taaki naya data turant UI me dikhe
      queryClient.invalidateQueries({
        queryKey: ["studentProfile", studentId],
      });
      toast.success("Profile saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save profile");
    },
  });

  return {
    updateProfile: mutate,
    isUpdating: isPending,
  };
};
