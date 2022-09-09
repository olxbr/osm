import { PublicClientApplication, NavigationClient } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../config";

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.enableAccountStorageEvents();

const requestAccessToken = async () => {
  const req = {
    ...loginRequest,
    account: msalInstance.getActiveAccount()
  };

  let res;

  try {
    res = await msalInstance.acquireTokenSilent(req);
    return res.accessToken;
  } catch (e) {
    res = await msalInstance.acquireTokenPopup(req);
    return res.accessToken;
  }
};

class CustomNavigationClient extends NavigationClient {
  constructor(history) {
      super();
      this.history = history;
  }

  async navigateInternal(url, options) {
      const relativePath = url.replace(window.location.origin, '');

      if (options.noHistory) {
          this.history.replace(relativePath);
      } else {
          this.history.push(relativePath);
      }

      return false;
  }
}

export {
  msalInstance,
  requestAccessToken,
  CustomNavigationClient
};
