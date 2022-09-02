import { PublicClientApplication } from "@azure/msal-browser";
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

export {
  msalInstance,
  requestAccessToken
};
