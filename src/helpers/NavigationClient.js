import { NavigationClient } from "@azure/msal-browser";

export class CustomNavigationClient extends NavigationClient{
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
