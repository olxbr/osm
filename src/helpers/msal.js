import { NavigationClient } from '@azure/msal-browser';
import { loginRequest } from '../config';

const requestAccessToken = async (msalInstance) => {
  const msalAccounts = msalInstance.getAllAccounts();

  if (!msalInstance.getActiveAccount() && msalAccounts.length > 0) {
    msalInstance.setActiveAccount(msalAccounts[0]);
  }

  let res;

  try {
    res = await msalInstance.acquireTokenSilent(loginRequest);
    return res.accessToken;
  } catch (e) {
    res = await msalInstance.acquireTokenPopup(loginRequest);
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

export { requestAccessToken, CustomNavigationClient };
