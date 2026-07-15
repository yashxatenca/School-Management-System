import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTeacherProfileAPI, updateTeacherProfileAPI } from "./profile.api";

export const useTeacherProfile = (isAuthenticated: boolean) => {
  const queryClient = useQueryClient();

  // Fetch Data Hook
  const { data: profile, isLoading } = useQuery({
    queryKey: ["teacherProfile"],
    queryFn: fetchTeacherProfileAPI,
    enabled: isAuthenticated, // Jab tak user auth na ho, API hit mat karo
    retry: false,
  });

  // Update Data Hook
  const updateMutation = useMutation({
    mutationFn: updateTeacherProfileAPI,
    onSuccess: () => {
      // Data save hone ke baad query invalidate karo taaki naya data fetch ho
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isSuccess: updateMutation.isSuccess,
  };
};
