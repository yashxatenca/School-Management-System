import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingLeaves, updateLeaveStatus } from "./leave.api";

export const usePendingLeaves = () => {
  return useQuery({
    queryKey: ["teacherPendingLeaves"],
    queryFn: getPendingLeaves,
  });
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeaveStatus,
    onSuccess: () => {
      // Mutation success hone par pending leaves ko dobara fetch karne ke liye invalidate karte hain
      queryClient.invalidateQueries({ queryKey: ["teacherPendingLeaves"] });
    },
    onError: (error) => {
      console.error("Status update failed:", error);
    },
  });
};
