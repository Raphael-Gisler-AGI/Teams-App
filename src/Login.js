import React, { useContext } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { authConfig, authScopes } from "../oAuthConfig";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CallClient, VideoStreamRenderer } from "@azure/communication-calling";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IncomingCallContext } from ".";

function Login() {
  const navigate = useNavigate();
  const { setIncomingCall } = useContext(IncomingCallContext);

  const handleLogIn = async (userDetails) => {
    try {
      const tokenCredential = new AzureCommunicationTokenCredential(
        userDetails.communicationUserToken.token
      );

      const callClient = new CallClient({
        diagnostics: {
          appName: "azure-communication-services",
          appVersion: "1.3.1-beta.1",
          tags: [
            "javascript_calling_sdk",
            `#clientTag:${userDetails.clientTag}`,
          ],
        },
        networkConfiguration: {
          proxy: undefined,
          turn: undefined,
        },
      });

      const deviceManager = await callClient.getDeviceManager();
      // const permissions = await deviceManager.askDevicePermission({
      //   audio: true,
      //   video: true,
      // });

      const callAgent = await callClient.createTeamsCallAgent(tokenCredential);

      window.callAgent = callAgent;
      window.videoStreamRenderer = VideoStreamRenderer;

      callAgent.on("incomingCall", (args) => {
        const incomingCall = args.incomingCall;
        setIncomingCall(incomingCall);
        navigate("/app/incoming");

        incomingCall.on("callEnded", (args) => {
          navigate("/app/overview");
        });
      });
      navigate("/app/overview");
    } catch (e) {
      console.error(e);
    }
  };

  const login = async () => {
    try {
      const oAuthObj = new PublicClientApplication(authConfig);
      const popupResponse = await oAuthObj.loginPopup({
        scopes: authScopes.popUpLogin,
      });
      const res = await axios({
        url: "teamsPopupLogin",
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-type": "application/json",
        },
        data: JSON.stringify({
          aadToken: popupResponse.accessToken,
          userObjectId: popupResponse.uniqueId,
        }),
      });
      if (res.status === 200) {
        handleLogIn(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div>
      <button onClick={login}>Sign In</button>
    </div>
  );
}

export default Login;
