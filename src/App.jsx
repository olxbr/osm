import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { CustomNavigationClient } from './helpers';
import { Layout } from './components';
import { SignIn } from './pages';
import { useStores } from './stores';
import { routes } from './routes';

const renderRoutes = (items, final = []) => {
  for (let item of items) {
    if ('Component' in item) {
      final.push(
        <Route exact path={item.path} key={item.name} render={(props) => <item.Component />} />
      );
    }
    if (item.items?.length) {
      renderRoutes(item.items, final);
    }
  }
  return final;
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
            <Switch>{renderRoutes(routes)}</Switch>
          </Layout>
        </AuthenticatedTemplate>
      </Provider>
    </MsalProvider>
  );
});

export default App;
