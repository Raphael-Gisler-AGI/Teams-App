import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

export const IncomingCallContext = React.createContext();

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
