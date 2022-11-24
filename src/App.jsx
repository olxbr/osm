import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { CustomNavigationClient } from './helpers';
import { Layout } from './components';
import { SignIn } from './pages';
import { useStores } from './stores';
import { flattenedRoutes } from './routes';

const renderRoutes = () => {
  return flattenedRoutes.map((route) => {
    if ('Component' in route) {
      return (
        <Route exact path={route.path} key={route.name} render={(props) => <route.Component />} />
      );
    }

    return null;
  });
};

const App = observer(({ msalInstance }) => {
  const history = useHistory();
  const { uiStore } = useStores();
  const navigationClient = new CustomNavigationClient(history);
  msalInstance.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={msalInstance}>
      <Provider theme={defaultTheme} colorScheme={uiStore.colorScheme}>
        <UnauthenticatedTemplate>
          <SignIn />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Layout>
            <Switch>{renderRoutes()}</Switch>
          </Layout>
        </AuthenticatedTemplate>
      </Provider>
    </MsalProvider>
  );
});

export default App;
