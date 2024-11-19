import { PublicClientApplication } from "@azure/msal-browser";
import { authConfig, authScopes } from "../../oAuthConfig";

export const utils = {
  teamsPopupLogin: async () => {
    const oAuthObj = new PublicClientApplication(authConfig);
    const response = await oAuthObj.loginPopup({
      scopes: authScopes.popUpLogin,
    });
    return response;
  },
};
