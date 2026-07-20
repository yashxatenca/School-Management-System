import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeave, deleteLeave, fetchLeave } from "./leave.api"; // अपना पाथ चेक करें
import { toast } from "react-toastify";

export const useGetLeaves = () => {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: fetchLeave,
    enabled: false,
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLeave,
    onSuccess: () => {
      toast.success("Leave requested successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit");
    },
  });
};

export const useDeleteLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLeave,
    onSuccess: () => {
      toast.success("Leave request deleted");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Delete failed");
    },
  });
};
