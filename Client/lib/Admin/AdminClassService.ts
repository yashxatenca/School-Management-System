import { api } from "../../api/axios";

export const classService = {
  getAll: () =>
    api.get("api/v1/admin/class").then((res) => {
      return res.data;
    }),
  create: (data: any) =>
    api.post("api/v1/admin/class", data).then((res) => res.data),
  update: (id: string, data: any) =>
    api.patch(`api/v1/admin/class/${id}`, data).then((res) => res.data),
  delete: (id: string) =>
    api.delete(`api/v1/admin/class/${id}`).then((res) => res.data),
};
