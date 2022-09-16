import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

export const axiosClient = axios.create({
  baseURL: "http://192.168.18.13:3000/api",
  timeout: 10000,
});

type audioResult = {
  mimetype: string;
  filename: string;
  path: string;
  size: number;
};

export default {
  get: async (
    url: string,
    basicAuth?: { applierId: string; pin: string },
    unauthorized?: () => void
  ) => {
    try {
      return await axiosClient.get(url, {
        ...basicAuthorization(basicAuth),
        timeout: 1000,
      });
    } catch (err) {
      if (/.+401$/i.test(err.message)) {
        unauthorized?.();
        return null;
      }
    }
  },
  post: async (
    url: string,
    data: any,
    basicAuth?: { applierId: string; pin: string },
    unauthorized?: () => void
  ) => {
    try {
      return await axiosClient.post(url, data, basicAuthorization(basicAuth));
    } catch (err) {
      if (/.+401$/i.test(err.message)) {
        unauthorized?.();
        return null;
      }
    }
  },
  uploadAudio: async (uri: string): Promise<audioResult> => {
    try {
      const response = await FileSystem.uploadAsync(
        `http://192.168.18.13:3000/api/upload/audio`,
        uri,
        {
          fieldName: "file",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        } as any
      );
      return JSON.parse(response.body) as audioResult;
    } catch (error) {
      console.log(error);
    }
  },
};

const basicAuthorization = (basicAuth?: { applierId: string; pin: string }) =>
  basicAuth && {
    headers: {
      authorization: "Basic " + base64Auth(basicAuth.applierId, basicAuth.pin),
    },
  };

const base64Auth = (applierId: string, pin: string) =>
  Buffer.from(`${applierId}:${pin}`, "utf8").toString("base64");
