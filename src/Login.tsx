import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { authConfig, authScopes } from "../oAuthConfig";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier } from "@azure/communication-common";
import { CallClient, TeamsIncomingCall, VideoStreamRenderer } from "@azure/communication-calling";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Setter, State, TeamsCallState, UserData } from "./Types";
import { PrimaryButton } from "@fluentui/react";
import { createStatefulCallClient } from "@azure/communication-react";
import { Client } from "@microsoft/microsoft-graph-client";

type LoginSetters = {
  setState: Setter<State | undefined>,
  setIncomingCall: Setter<TeamsIncomingCall | undefined>,
  setCallState: Setter<TeamsCallState | undefined>
}

function Login(setters: LoginSetters) {
  const navigate = useNavigate();
  const handleLogIn = async (userToken: string, userId: CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier, userData: UserData) => {
    try {
      const tokenCredential = new AzureCommunicationTokenCredential(
        userToken
      );

      const callClient = createStatefulCallClient({ userId: userId });

      const callAgent = await callClient.createTeamsCallAgent(tokenCredential);

      (window as any).callAgent = callAgent;
      (window as any).videoStreamRenderer = VideoStreamRenderer;

      callAgent.on("callsUpdated", (e) => {
        e.added.forEach((call) => {
          setters.setCallState(prev => {
            if (prev === undefined) return
            return {
              ...prev,
              teamsCall: call
            }
          })
          navigate("/app/call")
        });

        e.removed.forEach((call) => {
          setters.setCallState(prev => {
            if (prev === undefined) return
            if (prev.teamsCall !== call) return
            return {
              ...prev,
              teamsCall: undefined
            }
          })
          navigate("/app/overview")
        });
      });

      callAgent.on("incomingCall", (args) => {
        const incomingCall = args.incomingCall;
        setters.setIncomingCall(incomingCall);
        navigate("/app/incoming");

        incomingCall.on("callEnded", () => {
          navigate("/app/overview");
        });
      });

      const deviceManager = await callClient.getDeviceManager()

      const state: State = {
        callClient: callClient,
        callAgent: callAgent,
        deviceManager: deviceManager,
        userData: userData
      }

      setters.setState(state)

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

      const userData: UserData = {
        name: popupResponse.account?.name,
        username: popupResponse.account?.username
      }

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

      // const client = Client.init({ authProvider: (done) => { done(null, token) } })
      // const response = await client.api("/me").get();

      if (res.status === 200) {
        const data = res.data;
        const token = data.communicationUserToken.token;
        const userId = data.userId;
        handleLogIn(token, userId, userData);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="wrapLogin">
      <h1>Login to your Teams Account</h1>
      <PrimaryButton
        iconProps={{
          style: {
            verticalAlign: "middle",
            fontSize: "large",
          },
        }}
        onClick={() => login()}
      >
        Login
      </PrimaryButton>
    </div>
  );
}

export default Login;
