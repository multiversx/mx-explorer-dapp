import React, { useMemo, Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { GlobalProvider, useGlobalState } from './context';
import { TestnetType } from './context/state';
import Layout from './components/Layout';
import { HashRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import PageNotFoud from './components/PageNotFoud';
import routes from './routes';

const RouterDebugger = (props: any) => {
  React.useEffect(() => {
    console.warn(props);
  });
  return null;
};

const Debugger = withRouter(RouterDebugger);

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
            return routes.map((route, i) => {
              if (route.path.includes('validators') && validatorsDisabled) return null;
              return (
                <Route
                  path={`/${testnet.id}${route.path}`}
                  key={testnet.id + route.path}
                  exact
                  component={route.component}
                />
              );
            });
          })}
          <Route
            path={`${activeTestnet.id}/:any`}
            key={activeTestnet.id + '404'}
            exact
            component={PageNotFoud}
          />
          ,
          {routes.map((route, i) => {
            const validatorsDisabled = activeTestnet.validators === false;
            if (route.path.includes('validators') && validatorsDisabled) return null;
            return (
              <Route path={route.path} key={route.path + i} component={route.component} exact />
            );
          })}
          <Route component={PageNotFoud} />
        </Switch>
        <Debugger />
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
