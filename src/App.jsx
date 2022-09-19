import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { CustomNavigationClient } from './helpers';
import { Layout } from './components';
import { SignIn, Home } from './pages';
import { S3Home, S3FindBucket } from './pages/tools/S3';
import { useStores } from './stores';

export const routes = [
  {
    name: 'Home',
    path: '/',
    Component: Home,
  },
  {
    name: 'Tools',
    isHeader: true,
    items: [
      {
        name: 'S3',
        path: '/tools/s3',
        Component: S3Home,
        items: [
          {
            name: 'Find Bucket',
            path: '/tools/s3/find-bucket',
            Component: S3FindBucket,
          },
        ],
      },
    ],
  },
  {
    name: 'Services',
    isHeader: true,
    items: [
      {
        name: 'Security Hub',
        path: '/services/security-hub',
        Component: () => <div>Security Hub</div>,
        items: [],
      },
      {
        name: 'SIEM',
        path: '/services/siem',
        Component: () => <div>SIEM</div>,
        items: [],
      },
    ],
  },
];

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
