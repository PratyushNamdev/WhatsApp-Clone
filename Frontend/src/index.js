import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthState from "./Context/Authentication/AuthStates";
import ChatState from "./Context/Chat/ChatStates";
import LoadingState from "./Context/Loading/LoadingState";
import SocketState from "./Context/Socket/SocketStates";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LoadingState>
    <AuthState>
        <SocketState>
      <ChatState>
       
          <App />
        
      </ChatState>
        </SocketState>
    </AuthState>
  </LoadingState>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
