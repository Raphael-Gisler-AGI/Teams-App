import React from "react";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Overview from "./Overview";
import IncomingCall from "./IncomingCall";
import Login from "./Login";
import Header from "./Header";
import { IncomingCallContext } from ".";
import { TeamsIncomingCall } from "@azure/communication-calling";

function App() {
  const [incomingCall, setIncomingCall] = useState<TeamsIncomingCall>();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"
          element={
            <IncomingCallContext.Provider
              value={{ incomingCall: incomingCall, setIncomingCall: setIncomingCall }}
            >
              <Login />
            </IncomingCallContext.Provider>
          }
        />
        <Route
          path="/app"
          element={<Header />}
          children={[
            <Route path="/app/overview" element={<Overview />} />,
            <Route
              path="/app/incoming"
              element={
                <IncomingCallContext.Provider
                  value={{ incomingCall: incomingCall, setIncomingCall: setIncomingCall }}
                >
                  <IncomingCall />
                </IncomingCallContext.Provider>
              }
            />,
          ]}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
