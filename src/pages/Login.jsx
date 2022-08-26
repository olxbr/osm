import React from "react";
import { observer } from "mobx-react-lite";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config";

export const Login = observer(() => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => console.log(e));
  }

  return (
    <div className="app">
      <h1>Olx<br />Security<br />Manager</h1>
      <div className="login-box">
        <button onClick={handleLogin}>Sign-in</button>
      </div>
    </div>
  )
});
