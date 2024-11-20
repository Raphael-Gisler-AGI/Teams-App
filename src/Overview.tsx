import { ControlBarButton } from "@azure/communication-react";
import { TextField } from "@fluentui/react";
import { Call20Filled, Camera20Filled } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { Setter, State, TeamsCallState } from "./Types";
import { CommunicationIdentifier, createIdentifierFromRawId, MicrosoftTeamsAppIdentifier, MicrosoftTeamsUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from "@azure/communication-common";
import { getCallOptions } from "./Util/utils";
import { CallAgentKind, StartCallOptions } from "@azure/communication-calling";

function Overview({ state, setCallState }: { state: State, setCallState: Setter<TeamsCallState | undefined> }) {
  const [ids, setIds] = useState<string>("")
  const [phoneIds, setPhoneIds] = useState<string>("")
  const [alternateCallerId, setAlternateCallerId] = useState<string>("")

  const placeCall = async (withVideo: boolean) => {
    const identitiesToCall: CommunicationIdentifier[] = [];
    const userIdsArray: string[] = ids?.split(",");
    const phoneIdsArray: string[] = phoneIds.split(",");

    try {
      userIdsArray.forEach((userId: string) => {
        userId = userId.trim();
        if (userId.length === 0) return

        const identifier: CommunicationIdentifier = createIdentifierFromRawId(userId);
        if (!identitiesToCall.find((id) => id === identifier)) {
          identitiesToCall.push(identifier);
        }
      });

      phoneIdsArray.forEach((phoneNumberId: string) => {
        phoneNumberId = phoneNumberId.trim();
        if (phoneNumberId.length === 0) return

        const preIdentifier = "4:"
        if (phoneNumberId.slice(0, 2) !== preIdentifier) {
          phoneNumberId = preIdentifier + phoneNumberId
        }

        const identifier: CommunicationIdentifier = createIdentifierFromRawId(phoneNumberId);
        if (!identitiesToCall.find((id) => id === identifier)) {
          identitiesToCall.push(identifier);
        }
      });

      const callState = {} as TeamsCallState;
      const callOptions = await getCallOptions(false, withVideo, callState, state.deviceManager) as StartCallOptions;
      setCallState(callState)

      if (state.callAgent.kind === CallAgentKind.CallAgent && alternateCallerId.length > 0) {
        callOptions.alternateCallerId = {
          phoneNumber: alternateCallerId.trim(),
        };
      }

      state.callAgent.startCall(identitiesToCall as any, callOptions);
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="placeCall">
      <h2>Place a call</h2>
      <div>
        <TextField
          label={`Enter an Identity to make a call to. You can specify multiple Identities to call by using \",\" separated values.`}
          placeholder="IDs"
          onChange={({ currentTarget }) => setIds(currentTarget.value)}
        />
        <TextField
          label="Destination Phone Identity or Phone Identities"
          placeholder="4:+18881231234"
          onChange={({ currentTarget }) => setPhoneIds(currentTarget.value)}
        />
        <TextField
          label="If calling a Phone Identity, your Alternate Caller Id must be specified."
          placeholder="4:+18881231234"
          onChange={({ currentTarget }) => setAlternateCallerId(currentTarget.value)}
        />
      </div>
      <div className="callActions">
        <ControlBarButton
          title="Place call"
          strings={{ label: "Place call" }}
          showLabel
          onRenderIcon={() => <Call20Filled />}
          onClick={() => { placeCall(false) }}
        />
        <ControlBarButton
          title="Place call with video"
          strings={{ label: "Place call with video" }}
          showLabel
          onRenderIcon={() => <Camera20Filled />}
          onClick={() => { placeCall(true) }}
        />
      </div>
    </div>
  );
}

export default Overview;
