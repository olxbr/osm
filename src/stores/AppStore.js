import { makeAutoObservable } from 'mobx';
import { autoSave } from '../helpers';
import { accountList } from '../config';

class AppStore {
  account = null;

  constructor() {
    makeAutoObservable(this);
    this.account = accountList[0];
    autoSave(this, 'osm_AppStore');
  }

  setAccount(accountId) {
    for (let i = 0, l = accountList.length; i < l; i++) {
      if (accountList[i].id === accountId) {
        this.account = accountList[i];
        return;
      }
    }
  }
}

export default AppStore;
