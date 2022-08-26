import React from "react";
import { observer } from "mobx-react-lite";
import { useMsal } from "@azure/msal-react";

export const Profile = observer(() => {
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  }

  return (
    <div className="user-profile">
      <div className="box">
        <strong>logged user:</strong><br />
        {accounts[0].name}<br />
        {accounts[0].username}<br />
        <button onClick={handleLogout}>Sign-out</button>
      </div>
    </div>
  );
});
