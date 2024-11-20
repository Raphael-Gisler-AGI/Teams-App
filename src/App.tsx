import React from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Overview from "./Overview";
import IncomingCall from "./IncomingCall";
import Login from "./Login";
import Header from "./Header";
import { TeamsIncomingCall } from "@azure/communication-calling";
import { darkTheme, DEFAULT_COMPONENT_ICONS, FluentThemeProvider } from "@azure/communication-react";
import { initializeIcons, registerIcons } from "@fluentui/react";
import { State, TeamsCallState } from "./Types";
import Call from "./Call";

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App() {
  const [incomingCall, setIncomingCall] = useState<TeamsIncomingCall>();
  const [state, setState] = useState<State>();
  const [callState, setCallState] = useState<TeamsCallState>();

  return (
    <FluentThemeProvider fluentTheme={darkTheme} rootStyle={{ minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setState={setState} setIncomingCall={setIncomingCall} setCallState={setCallState} />} />
          <Route
            path="/app"
            element={<Header userData={state?.userData} />}
            children={[
              <Route path="/app/overview" element={<Overview state={state!} setCallState={setCallState} />} />,
              <Route path="/app/incoming" element={<IncomingCall state={state!} incomingCall={incomingCall!} setCallState={setCallState} />} />,
              <Route path="/app/call" element={<Call state={state!} teamsCallState={callState!} />} />
            ]}
          />
        </Routes>
      </BrowserRouter>
    </FluentThemeProvider>
  );
}

export default App;
