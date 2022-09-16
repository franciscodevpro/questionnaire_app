import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApplierEntity } from "../entities/Applier.type";
import api from "./api";

export const saveLocalAppliers = async (
  appliers: ApplierEntity[]
): Promise<void> => {
  await AsyncStorage.setItem(
    `@questionnaire:appliers`,
    JSON.stringify(appliers)
  );
};

export const getLocalAppliers = async (): Promise<ApplierEntity[]> => {
  const result = await AsyncStorage.getItem(`@questionnaire:appliers`);
  return !!result ? JSON.parse(result) : [];
};

export const getAppliers = async (): Promise<ApplierEntity[]> => {
  const result = await api.get("/appliers");
  if (!result?.data?.[0]) return await getLocalAppliers();

  await saveLocalAppliers(result.data);
  return result?.data || [];
};
