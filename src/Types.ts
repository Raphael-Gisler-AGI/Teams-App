import {
  DeviceManager,
  TeamsCall,
  TeamsCallAgent,
  TeamsIncomingCall,
} from "@azure/communication-calling";
import { StatefulCallClient } from "@azure/communication-react";
import { Dispatch, SetStateAction } from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export interface IncomingCall {
  incomingCall: TeamsIncomingCall | undefined;
  setIncomingCall: Setter<TeamsIncomingCall | undefined>;
}

export interface UserData {
  name: string | undefined;
  username: string | undefined;
}

export type CallDevice = {
  selectedId: string;
  options: { id: string; name: string }[];
};

export interface TeamsCallState {
  teamsCall: TeamsCall | undefined;
  camera: CallDevice;
  speakers: CallDevice;
  microphones: CallDevice;
  alternateCallerId: string;
}

export interface State {
  callAgent: TeamsCallAgent;
  callClient: StatefulCallClient;
  deviceManager: DeviceManager;
  userData: UserData;
}
