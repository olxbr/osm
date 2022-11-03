import { makeAutoObservable } from 'mobx';
import { autoSave } from '../helpers';
import { osmApiUrl } from '../config';

class AppStore {
  account = {};
  accounts = [];

  constructor() {
    makeAutoObservable(this);
    this.account = { name: 'All Accounts', id: 'allAccounts' };
    autoSave(this, 'osm_AppStore', true); // true = sessionStorage
  }

  fetchConfig = async (accessToken, params = {}) => {
    params = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${osmApiUrl}/config?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.log(`Error fetching /config: ${res.statusText}`);
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  fetchAccounts = async (accessToken) => {
    if (this.accounts.length) {
      return this.accounts;
    }

    const result = await this.fetchConfig(accessToken, { fn: 'accounts' });
    this.setAccounts(result);

    return result;
  };

  setAccounts(accountList) {
    accountList.sort((a, b) => a.name.localeCompare(b.name));
    this.accounts = [{ name: 'All Accounts', id: 'allAccounts' }, ...accountList];
  }

  setAccount(accountId) {
    for (let i = 0, l = this.accounts.length; i < l; i++) {
      if (this.accounts[i].id === accountId) {
        this.account = this.accounts[i];
        return;
      }
    }
  }
}

export default AppStore;
