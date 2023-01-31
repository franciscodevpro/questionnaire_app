import axios from "axios";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

const servers = {
  api: "http://192.168.1.8:3000/api",
  audioUpload: "http://192.168.1.8:3000/api/upload/audio",
};

export const axiosClient = axios.create({
  //baseURL: "http://18.222.199.243:3000/api",
  baseURL: servers.api,
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
      console.log({ requestData: data, url });
      console.log(err.message);
      if (/.+401$/i.test(err.message)) {
        unauthorized?.();
        return null;
      }
    }
  },
  uploadAudio: async (uri: string): Promise<audioResult> => {
    try {
      const response = await FileSystem.uploadAsync(servers.audioUpload, uri, {
        fieldName: "file",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      } as any);
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
