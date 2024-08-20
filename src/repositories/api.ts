import axios from "axios";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import fs from "fs";
import path from "path";
const AWS = require("aws-sdk");

const servers = {
  api: "http://192.168.1.8:3000/api",
  audioUpload: "http://192.168.1.8:3000/api/upload/audio",
};

export const axiosClient = axios.create({
  //baseURL: "http://18.222.199.243:3000/api",
  baseURL: servers.api,
  timeout: 10000,
});

const USE_S3_UPLOAD = false;
const AWS_REGION = null;
const AWS_CREDENTIALS_ACCESSKEYID = null;
const AWS_CREDENTIALS_SECRETACCESSKEY = null;
const AWS_APIVERSION = null;
const AWS_S3_BUCKETNAME = null;
const AWS_S3_ACL = null;

AWS.config.update({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_CREDENTIALS_ACCESSKEYID,
    secretAccessKey: AWS_CREDENTIALS_SECRETACCESSKEY,
  },
});
var s3 = new AWS.S3({ apiVersion: AWS_APIVERSION });

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

  uploadToS3: (uri: string) => {
    const bucketName = AWS_S3_BUCKETNAME;
    var fileStream = fs.createReadStream(uri);
    fileStream.on("error", function (err) {
      console.log("File Error", err);
    });
    const uploadParams = {
      Bucket: bucketName,
      Key: path.basename(Date.now().toString()),
      Body: fileStream,
      ACL: AWS_S3_ACL,
    };
    console.log(uploadParams);
    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      }
      if (data) {
        console.log("Upload Success", data.Location);
      }
    });
  },
  uploadAudio: async function (uri: string): Promise<audioResult | null> {
    try {
      if (USE_S3_UPLOAD) {
        this.uploadToS3(uri);
        return null;
      }

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
  uploadMultipleAudio: async function (
    uris: string[]
  ): Promise<(audioResult | null)[]> {
    return Promise.all(uris.map((elm) => this.uploadAudio(elm)));
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
