import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TeamsIncomingCall } from "@azure/communication-calling";

export interface IncomingCallContext {
    incomingCall: TeamsIncomingCall | undefined,
    setIncomingCall: React.Dispatch<React.SetStateAction<TeamsIncomingCall | undefined>>
}

export const IncomingCallContext = React.createContext<IncomingCallContext | undefined>(undefined);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
