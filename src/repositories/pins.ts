import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEntity } from "../entities/device.type";
import api from "./api";

export const saveLocalDevices = async (
  devices: DeviceEntity[]
): Promise<void> => {
  await AsyncStorage.setItem(`@questionnaire:devices`, JSON.stringify(devices));
};

export const getLocalDevices = async (): Promise<DeviceEntity[]> => {
  const result = await AsyncStorage.getItem(`@questionnaire:devices`);
  return !!result ? JSON.parse(result) : [];
};

export const getDevices = async (): Promise<DeviceEntity[]> => {
  const result = await api.get("/devices");
  if (!result?.data?.[0]) {
    const localResult = await getLocalDevices();
    console.log({ localResult });
    return localResult;
  }
  console.log({ data: result.data });

  await saveLocalDevices(result.data);
  return result?.data || [];
};

export const validadePin = async (pin: string): Promise<boolean> => {
  const devices = await getDevices();
  if (!devices?.[0]) return false;
  return !!devices.find((elm) => elm.pin === pin);
};
