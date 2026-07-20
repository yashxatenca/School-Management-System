// hooks/useNotices.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
// Match this with your Mongoose INotice interface
export interface Notice {
  _id: string;
  title: string;
  content: string;
  classId: string;
  createdBy: { _id: string; name: string; role: string };
  createdAt: string;
}

const fetchNotices = async (classId: string): Promise<Notice[]> => {
  const { data } = await api.get(`/api/v1/student/notice/class/${classId}`);

  return data.data;
};

export const useClassNotices = (classId: string) => {
  return useQuery({
    queryKey: ["notices", classId],
    queryFn: () => fetchNotices(classId),
    enabled: !!classId, // Prevents query from running if classId is undefined
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
