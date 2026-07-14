import { api } from "@/api/axios";

export interface Timetable {
  _id: string;
  title: string;
  category: string;
  teacherId: string;
  driveLink: string;
  createdAt: string;
}

export type CreateTimetableDTO = Omit<Timetable, "_id" | "createdAt">;
export type UpdateTimetableDTO = Partial<CreateTimetableDTO>;

export const TimetableAPI = {
  create: async (data: CreateTimetableDTO): Promise<Timetable> => {
    const response = await api.post("api/v1/admin/timetable/teacher/", data);
    return response.data.data;
  },

  getByClassId: async (teacherId: string): Promise<Timetable[]> => {
    const response = await api.get(
      `api/v1/admin/timetable/teacher/teacher/${teacherId}`,
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Timetable> => {
    // Note: Added /student/ here, revert if your backend specifically uses /timetable/${id}
    const response = await api.get(`api/v1/admin/timetable/teacher/${id}`);
    return response.data.data;
  },

  update: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateTimetableDTO;
  }): Promise<Timetable> => {
    const response = await api.patch(
      `api/v1/admin/timetable/teacher/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`api/v1/admin/timetable/teacher/${id}`);
  },
};
