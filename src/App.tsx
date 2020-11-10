import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PageNotFoud from './components/PageNotFoud';
import { GlobalProvider, useGlobalState } from './context';
import { ConfigType, NetworkType } from './context/state';
import routes from './routes';

export const Routes = ({
  routes,
}: {
  routes: { path: string; component: React.ComponentClass }[];
}) => {
  const {
    config: { networks },
    activeNetwork,
  } = useGlobalState();

  return useMemo(
    () => (
      <Switch>
        {networks.map((network: NetworkType, i: number) => {
          return routes.map((route, i) => {
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
        {routes.map((route, i) => {
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
    [networks, activeNetwork, routes]
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
      <Layout>
        <Routes routes={routes} />
      </Layout>
    </GlobalProvider>
  );
};

const RoutedApp = () => {
  const DevWrapper = ({ children }: any) => <>{children}</>;
  const ProdErrorBoundary = process.env.NODE_ENV === 'production' ? ErrorBoundary : DevWrapper;

  return (
    <ProdErrorBoundary>
      <Router>
        <App />
      </Router>
    </ProdErrorBoundary>
  );
};

export default hot(RoutedApp);
