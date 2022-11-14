import { makeAutoObservable } from 'mobx';
import { autoSave } from '../helpers';
import { osmApiUrl } from '../config';

class S3ToolsStore {
  findBucketData = {
    account: null,
    query: '',
    data: [],
  };
  listBucketsData = {
    account: null,
    updated_at: null,
    buckets: [],
  };
  bucketsSummary = {
    account: null,
    buckets: [],
  };

  constructor() {
    makeAutoObservable(this);
    autoSave(this, 'osm_S3ToolsStore', true); // true -> sessionStorage
  }

  async fetchS3Tools(accessToken, params) {
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
  }

  async putS3Tools(accessToken, body, params) {
    params = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${osmApiUrl}/s3-tools?${params}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = `Put error /s3-tools: ${res.statusText}`;
        console.log(msg);
        return { message: msg };
      }

      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  async findBucket(accessToken, params) {
    params.fn = 'find-bucket';
    const data = await this.fetchS3Tools(accessToken, params);
    if (!data) return { buckets: [] };
    return data;
  }

  async listBuckets(accessToken, params) {
    params.fn = 'list-buckets';
    const data = await this.fetchS3Tools(accessToken, params);
    if (!data) return { buckets: [] };
    return data;
  }

  async listBucketsSummary(accessToken, params) {
    params.fn = 'list-buckets-summary';
    return await this.fetchS3Tools(accessToken, params);
  }

  async getBucketSummary(accessToken, params) {
    params.fn = 'get-bucket-summary';
    return await this.fetchS3Tools(accessToken, params);
  }

  async putBucketSummary(accessToken, body, params = {}) {
    params.fn = 'put-bucket-summary';
    return await this.putS3Tools(accessToken, body, params);
  }

  setFindBucketData(value) {
    this.findBucketData = value;
  }

  addFindBucketData(value) {
    this.findBucketData.data.push(value);
  }

  setListBucketsData(value) {
    this.listBucketsData = value;
  }

  getBucketFromList(bucketName) {
    for (let b of this.listBucketsData.buckets) {
      if (b.name === bucketName) {
        return b;
      }
    }
    return null;
  }

  resetListBucketsData() {
    this.listBucketsData = {
      account: null,
      updated_at: null,
      buckets: [],
    };
  }

  resetFindBucketData() {
    this.findBucketData = {
      account: null,
      query: '',
      searchBy: '',
      data: [],
    };
  }

  setBucketsSummary(value) {
    this.bucketsSummary = value;
  }

  updateBucketSummary(bucketName, summaryOpts) {
    const { account, buckets } = this.bucketsSummary;
    let bucketsClone = JSON.parse(JSON.stringify(buckets));

    bucketsClone = bucketsClone.map((b) => {
      if (b.bucket === bucketName) {
        return { ...b, ...summaryOpts };
      }
      return b;
    });

    this.setBucketsSummary({
      account,
      buckets: bucketsClone,
    });
  }

  mergeSummary() {
    const { account, updated_at, buckets } = this.listBucketsData;
    let bucketsClone = JSON.parse(JSON.stringify(buckets));

    bucketsClone.map((b) => {
      for (let s of this.bucketsSummary.buckets) {
        if (b.name === s.bucket) {
          b.summary = s;
        }
      }
      return b;
    });

    this.setListBucketsData({
      account,
      updated_at,
      buckets: bucketsClone,
    });
  }
}

export default S3ToolsStore;
