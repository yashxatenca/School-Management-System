// hooks/useAdminQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProfile,
  createAdminProfile,
  updateAdminProfile,
  getSchoolInfo,
  updateSchoolInfo,
  AdminProfile,
  SchoolInfo,
} from "@/lib/Admin/AdminProfile.api";

// --- Admin Hooks ---
export const useAdminProfileQuery = () => {
  return useQuery({
    queryKey: ["adminProfile"],
    queryFn: getAdminProfile,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminProfileMutation = (
  profileExists: boolean,
  onSuccessCallback: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<AdminProfile>) =>
      profileExists ? updateAdminProfile(payload) : createAdminProfile(payload),
    onSuccess: (updatedData) => {
      // Directly update the cache with the new data structure
      queryClient.setQueryData(["adminProfile"], updatedData);
      onSuccessCallback();
    },
  });
};

// --- School Hooks ---
export const useSchoolInfoQuery = () => {
  return useQuery({
    queryKey: ["schoolInfo"],
    queryFn: getSchoolInfo,
  });
};

export const useSchoolInfoMutation = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<SchoolInfo>) => updateSchoolInfo(payload),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["schoolInfo"], updatedData);
      onSuccessCallback();
    },
  });
};
