import { makeAutoObservable } from 'mobx';
import { autoSave } from '../helpers';
import { osmApiUrl } from '../config';

class IAMStore {
  listRolesData = {
    account: null,
    updatedAt: null,
    roles: [],
  };
  rolesSummary = {
    account: null,
    roles: [],
  };

  constructor() {
    makeAutoObservable(this);
    autoSave(this, 'osm_IAMStore');
  }

  async fetchIAMTools(accessToken, params) {
    params = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${osmApiUrl}/iam-tools?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.log(`Error fetching /iam-tools: ${res.statusText}`);
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  async listRoles(accessToken, params) {
    params.fn = 'list-roles';
    const data = await this.fetchIAMTools(accessToken, params);
    if (!data) return { roles: [] };
    return data;
  }

  async getRole(accessToken, params) {
    params.fn = 'get-role';
    const data = await this.fetchIAMTools(accessToken, params);
    if (!data) return { role: {} };
    return data;
  }

  async listRolesSummary(accessToken, params) {
    params.fn = 'list-roles-summary';
    return await this.fetchIAMTools(accessToken, params);
  }

  async getRoleSummary(accessToken, params) {
    params.fn = 'get-role-summary';
    return await this.fetchIAMTools(accessToken, params);
  }

  setListRolesData(value) {
    this.listRolesData = value;
  }

  setRolesSummary(value) {
    this.rolesSummary = value;
  }

  mergeSummary() {}

  resetListRolesData() {
    this.listRolesData = {
      account: null,
      updatedAt: null,
      roles: [],
    };
  }

  getRole(roleName) {
    let role = null;

    for (let r of this.listRolesData.roles) {
      if (r.RoleName === roleName) {
        role = r;
        break;
      }
    }

    return role;
  }
}

export default IAMStore;
