import { makeAutoObservable } from 'mobx';
import { autoSave } from '../helpers';
import { osmApiUrl } from '../config';

class EC2Store {
  findInstanceData = {
    account: null,
    ip: '',
    ipType: 'public',
    data: [],
  };

  constructor() {
    makeAutoObservable(this);
    autoSave(this, 'osm_EC2Store', true); // true -> sessionStorage
  }

  async fetchEC2Tools(accessToken, params) {
    params = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${osmApiUrl}/ec2-tools?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.log(`Error fetching /ec2-tools: ${res.statusText}`);
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  async findInstance(accessToken, params) {
    params.fn = 'find-instance';
    const data = await this.fetchEC2Tools(accessToken, params);
    if (!data) return { instances: [] };
    return data;
  }

  setFindInstanceData(value) {
    this.findInstanceData = value;
  }

  addFindInstanceData(value) {
    this.findInstanceData.data.push(value);
  }

  resetFindInstanceData() {
    this.findInstanceData = {
      account: null,
      ip: '',
      ipType: 'public',
      data: [],
    };
  }
}

export default EC2Store;
