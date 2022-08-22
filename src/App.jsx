import {
  AuthenticatedTemplate,
  // UnauthenticatedTemplate,
  useMsal,
  useIsAuthenticated
} from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { Profile } from "./components";

const App = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => console.log(e));
  }

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  }

  return (
    <div className="app">
      <h1>Olx<br />Security<br />Manager</h1>
      <AuthenticatedTemplate>
        <Profile />
      </AuthenticatedTemplate>
      <div className="login-box">
        {isAuthenticated
          ? <button onClick={handleLogout}>Sign-out</button>
          : <button onClick={handleLogin}>Sign-in</button>}
      </div>
    </div>
  );
}

export default App;
