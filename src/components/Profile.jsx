import { useMsal } from "@azure/msal-react";

export const Profile = () => {
  const { accounts } = useMsal();

  return (
    <div className="user-profile">
      <strong>logged user:</strong><br />
      {accounts[0].name}<br />
      {accounts[0].username}
    </div>
  );
}
