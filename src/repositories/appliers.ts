import api from "./api";

export const getAppliers = async (): Promise<
  { id: string; isActive: boolean; name: string }[]
> => {
  const result = await api.get("/appliers");
  return result?.data || [];
};
