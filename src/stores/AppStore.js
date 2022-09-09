import { makeAutoObservable } from "mobx";
import { autoSave } from "../helpers";
import { osmConfig } from '../config';

class AppStore {
  account = null;
  awsAccounts = osmConfig.awsAccounts;;

  constructor() {
    makeAutoObservable(this);
    this.account = this.awsAccounts[0];
    autoSave(this, "appStore");
  }

  setAccount(accountId) {
    for (let i=0, l=this.awsAccounts.length; i<l; i++) {
      if (this.awsAccounts[i].id === accountId) {
        this.account = this.awsAccounts[i];
        return;
      }
    }
  }
}

export default AppStore;
