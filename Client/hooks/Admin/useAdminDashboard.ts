import { useQuery } from "@tanstack/react-query";
import { getTotalDashboard } from "@/lib/Admin/Admin.dashboard.api";

export const useGetTotalDashboard = () => {
  return useQuery({
    queryKey: ["total_dashboard"],
    queryFn: getTotalDashboard,
  });
};
