import { useIsMainnet } from 'helpers';
import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AxiosInterceptor } from 'components';
import { Layout } from './pages/Layout';
import { PageNotFound } from './pages/PageNotFound';
import { GlobalProvider, useGlobalState } from './context';
import { ConfigType, NetworkType } from './context/state';
import { Routes as WrappedRoutes, validatorsRoutes } from './routes';

export const Routes = ({
  routes,
}: {
  routes: { path: string; component: React.ComponentClass }[];
}) => {
  const {
    config: { networks },
    activeNetwork,
  } = useGlobalState();
  const isMainnet = useIsMainnet();

  const restrictedRoutes = routes.filter(({ path }) => {
    if (
      (!isMainnet &&
        [validatorsRoutes.identities, validatorsRoutes.identityDetails].includes(path)) ||
      (activeNetwork.adapter === 'elastic' && Object.values(validatorsRoutes).includes(path))
    ) {
      return false;
    }
    return true;
  });

  return useMemo(
    () => (
      <Switch>
        {networks.map((network: NetworkType, i: number) => {
          return restrictedRoutes.map((route, i) => {
            return (
              <Route
                path={`/${network.id}${route.path}`}
                key={network.id + route.path}
                exact={true}
                component={route.component}
              />
            );
          });
        })}
        <Route
          path={`${activeNetwork.id}/:any`}
          key={activeNetwork.id + '404'}
          exact={true}
          component={PageNotFound}
        />
        ,
        {restrictedRoutes.map((route, i) => {
          return (
            <Route
              path={route.path}
              key={route.path + i}
              component={route.component}
              exact={true}
            />
          );
        })}
        <Route component={PageNotFound} />
      </Switch>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [networks, activeNetwork.id]
  );
};

export const App = ({ optionalConfig }: { optionalConfig?: ConfigType }) => {
  return (
    <GlobalProvider optionalConfig={optionalConfig}>
      <AxiosInterceptor>
        <Layout>
          <Routes routes={WrappedRoutes} />
        </Layout>
      </AxiosInterceptor>
    </GlobalProvider>
  );
};

const RoutedApp = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default hot(RoutedApp);
