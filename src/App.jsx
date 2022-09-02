import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { observer } from "mobx-react-lite";
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate
} from "@azure/msal-react";
import { CustomNavigationClient } from "./helpers";
import { Layout } from "./components";
import { SignIn, Home, S3Tools } from "./pages";
import { useRootStore } from "./stores";

export const routes = [
  { path: "/s3-tools", name: "S3 Tools", Component: S3Tools },
  { path: "/", name: "OSM", Component: Home }
];

const App = observer(({ msalInstance }) => {
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  msalInstance.setNavigationClient(navigationClient);
  const { uiStore } = useRootStore();

  return (
    <MsalProvider instance={msalInstance}>
      <Provider theme={defaultTheme} colorScheme={uiStore.colorScheme}>
        <UnauthenticatedTemplate>
          <SignIn />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Layout>
            <Switch>
              {routes.map(({ path, Component }, key) => (
                <Route exact path={path} key={key} render={props => <Component />} />
              ))}
            </Switch>
          </Layout>
        </AuthenticatedTemplate>
      </Provider>
    </MsalProvider>
  );
});

export default App;
