import { makeAutoObservable } from "mobx";
import { autoSave, requestAccessToken } from "../helpers";
import { osmConfig } from "../config";

class S3ToolsStore {
  buckets = [];

  constructor() {
    makeAutoObservable(this);
    autoSave(this, "s3ToolsStore");
  }

  fetchS3Tools = async (params) => {
    const accessToken = await requestAccessToken();
    let result = null;

    try {
      const res = await fetch(`${osmConfig.apiUrl}/s3-tool`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      result = await res.json();
    } catch (err) {
      console.log(err);
    }

    return result;
  };
}

export default S3ToolsStore;
