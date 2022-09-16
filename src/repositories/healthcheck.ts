import api from "./api";

export const healthCheck = async (): Promise<boolean> => {
  const result = await api.get("/healthcheck");
  if (result?.data?.ok) return true;
  return false;
};
