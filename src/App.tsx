import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider, useGlobalState } from './context';
import { TestnetType } from './context/state';
import Layout from './components/Layout';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import PageNotFoud from './components/PageNotFoud';
import routes from './routes';

const Routes = () => {
  const {
    config: { testnets },
    activeTestnet,
  } = useGlobalState();

  return useMemo(
    () => (
      <React.Suspense fallback={<span>Loading...</span>}>
        <Switch>
          {testnets.map((testnet: TestnetType, i: number) => {
            const validatorsDisabled = testnet.validators === false;
            return (
              <Route
                path={`/${testnet.id}`}
                key={testnet.id + i}
                render={({ match: { url } }) => {
                  return [
                    routes.map(route => {
                      if (route.path.includes('validators') && validatorsDisabled) return null;
                      return (
                        <Route
                          path={`${url}${route.path}`}
                          key={testnet.id + route.path}
                          exact
                          component={route.component}
                        />
                      );
                    }),
                    <Route key="404" path={`${url}`} component={PageNotFoud} />,
                  ];
                }}
              />
            );
          })}
          {routes.map((route, i) => {
            const validatorsDisabled = activeTestnet.validators === false;
            if (route.path.includes('validators') && validatorsDisabled) return null;
            return (
              <Route path={route.path} key={route.path + i} component={route.component} exact />
            );
          })}
          <Route component={PageNotFoud} />
        </Switch>
      </React.Suspense>
    ),
    [testnets, activeTestnet]
  );
};

export const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Layout>
        <Routes />
      </Layout>
    </GlobalProvider>
  );
};

const RoutedApp = () => (
  <Router>
    <App />
  </Router>
);

export default hot(RoutedApp);
