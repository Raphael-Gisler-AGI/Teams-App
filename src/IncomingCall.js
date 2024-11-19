import React, { useContext, useEffect } from "react";
import { IncomingCallContext } from ".";

function IncomingCall() {
  const { incomingCall } = useContext(IncomingCallContext);

  return (
    <div>
      <h1>Call</h1>
    </div>
  );
}

export default IncomingCall;
