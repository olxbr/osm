import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite"
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate
} from "@azure/msal-react";
import { CustomNavigationClient } from "./utils/NavigationClient";
import { Layout } from "./components";
import { Login, Home } from "./pages";
import { S3Tool } from "./pages/S3Tool";

const App = observer(({ msalInstance }) => {
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  msalInstance.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={msalInstance}>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <Layout>
          <Switch>
            <Route path="/s3-tool">
              <S3Tool />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Layout>
      </AuthenticatedTemplate>
    </MsalProvider>
  );
});

export default App;
