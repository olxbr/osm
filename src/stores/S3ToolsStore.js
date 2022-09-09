import { makeAutoObservable } from "mobx";
import { autoSave, requestAccessToken } from "../helpers";
import { osmConfig } from "../config";

class S3ToolsStore {
  lastResult = null;

  constructor() {
    makeAutoObservable(this);
    autoSave(this, "s3ToolsStore");
  }

  fetchS3Tools = async (params) => {
    const accessToken = await requestAccessToken();
    let result = null;
    params = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${osmConfig.apiUrl}/s3-tools?${params}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      result = await res.json();
      this.lastResult = result;
    } catch (err) {
      console.log(err);
    }

    return result;
  };
}

export default S3ToolsStore;
