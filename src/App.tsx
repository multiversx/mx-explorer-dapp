import { useIsMainnet } from 'helpers';
import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AxiosErrorHandler } from 'sharedComponents';
import Layout from './components/Layout';
import PageNotFoud from './components/PageNotFoud';
import { GlobalProvider, useGlobalState } from './context';
import { ConfigType, NetworkType } from './context/state';
import routes, { validatorsRoutes } from './routes';

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
    if (!isMainnet && [validatorsRoutes.index, validatorsRoutes.identityDetails].includes(path)) {
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
          component={PageNotFoud}
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
        <Route component={PageNotFoud} />
      </Switch>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [networks, activeNetwork.id]
  );
};

export const App = ({ optionalConfig }: { optionalConfig?: ConfigType }) => {
  React.useEffect(() => {
    if (process.env.REACT_APP_CACHE_BUST) {
      // tslint:disable-next-line
      console.log('Elrond Explorer version: ', process.env.REACT_APP_CACHE_BUST);
    }
  }, []);

  return (
    <GlobalProvider optionalConfig={optionalConfig}>
      <AxiosErrorHandler>
        <Layout>
          <Routes routes={routes} />
        </Layout>
      </AxiosErrorHandler>
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
