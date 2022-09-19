import { makeAutoObservable } from 'mobx';
import {
  // autoSave,
  requestAccessToken,
} from '../helpers';
import { osmApiUrl } from '../config';

class S3ToolsStore {
  lastResult = null;

  constructor() {
    makeAutoObservable(this);
    // autoSave(this, 'osm_S3ToolsStore');
  }

  fetchS3Tools = async (params) => {
    const accessToken = await requestAccessToken();
    params = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${osmApiUrl}/s3-tools?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.log(`Error fetching /s3-tools: ${res.statusText}`);
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error(err);
    }

    return null;
  };
}

export default S3ToolsStore;
