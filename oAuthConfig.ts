const authConfig = {
  auth: {
    clientId: "3aba0567-04f1-4175-96a5-98416f517950",
    authority:
      "https://login.microsoftonline.com/9a46066a-0ba8-4315-90b1-715e6c1798d0",
  },
};
// Add here scopes for id token to be used at MS Identity Platform endpoints.
const authScopes = {
  popUpLogin: [
    "https://auth.msft.communication.azure.com/Teams.ManageCalls",
    "https://auth.msft.communication.azure.com/Teams.ManageChats",
  ],
  m365Login: [
    "https://auth.msft.communication.azure.com/Teams.ManageCalls",
    "https://auth.msft.communication.azure.com/Teams.ManageChats",
  ],
};

export {authConfig, authScopes}
// module.exports = { authConfig, authScopes };
