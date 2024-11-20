import React, { useState } from "react";
import { IncomingCall, Setter, State, TeamsCallState } from "./Types";
import { Icon, PrimaryButton } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { TeamsIncomingCall } from "@azure/communication-calling";
import { ActiveErrorMessage, EndCallButton, ErrorBar } from "@azure/communication-react";
import { getCallOptions } from "./Util/utils";

function IncomingCall({ state, incomingCall, setCallState }: { state: State, incomingCall: TeamsIncomingCall, setCallState: Setter<TeamsCallState | undefined> }) {
  const navigate = useNavigate()
  const [errorMessages, setErrorMessages] = useState<ActiveErrorMessage[]>([])


  const startCall = async (isMuted: boolean, hasVideo: boolean) => {
    const callState = {} as TeamsCallState;
    const errors: ActiveErrorMessage[] = [];

    const callOptions = await getCallOptions(isMuted, hasVideo, callState, state.deviceManager, errors)

    if (errors.length > 0) {
      setErrorMessages(errors)
      return
    }

    setCallState(callState)

    incomingCall?.accept(callOptions)
  }

  if (incomingCall === undefined) {
    return
  }

  return (
    <div className="wrapIncomingCall">
      <ErrorBar activeErrorMessages={errorMessages}></ErrorBar>
      <div className="incomingCall">
        <h2>{incomingCall.callerInfo.displayName} is calling...</h2>
        <div className="callOptions">
          <PrimaryButton
            title="Answer call with microphone unmuted and video off"
            onClick={async () => startCall(false, false)}
          >
            <Icon iconName="Microphone" />
            <Icon iconName="VideoOff" />
          </PrimaryButton>

          <PrimaryButton
            title="Answer call with microphone unmuted and video on"
            onClick={async () =>
              startCall(false, true)
            }
          >
            <Icon iconName="Microphone" />
            <Icon iconName="Video" />
          </PrimaryButton>
          <PrimaryButton
            title="Answer call with microphone muted and video on"
            onClick={async () =>
              startCall(true, true)
            }
          >
            <Icon iconName="MicOff" />
            <Icon iconName="Video" />
          </PrimaryButton>
          <PrimaryButton
            title="Answer call with microphone muted and video off"
            onClick={async () =>
              startCall(true, false)
            }
          >
            <Icon iconName="MicOff" />
            <Icon iconName="VideoOff" />
          </PrimaryButton>
          <EndCallButton
            title="Reject call"
            onClick={() => {
              incomingCall.reject();
              navigate("/app/overview")
            }}
          />
        </div>
      </div>
    </div >
  );
}

export default IncomingCall;
